/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

import { TurboModule,TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import window from '@ohos.window';
import common from '@ohos.app.ability.common'
import { BusinessError } from '@ohos.base';
import {Platform} from './Platform'
import { UnistylesConfig} from './Config'
import mediaquery from '@ohos.mediaquery';
import Logger from './Logger';
import type EnvironmentCallback from '@ohos.app.ability.EnvironmentCallback';
import ConfigurationConstant from '@ohos.app.ability.ConfigurationConstant';

export class RNUnistylesTurboModule extends TurboModule {
  context: common.UIAbilityContext;
  ctx :TurboModuleContext;
  isCxxReady: Boolean = false;
  platform: Platform = null;
  //横屏数据
  direction:string = 'vertical';

  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
    this.context = ctx.uiAbilityContext;
    this.onRNUnistylesEvent();
  }

  install(): object {
    let data;
    try {
      this.platform = new Platform(this.ctx.uiAbilityContext,this.ctx);
      if(this.platform.getLayoutConfig().screen.width >this.platform.getLayoutConfig().screen.height)
        this.direction = 'landscape';
      data = {
        "status":true,
        "screen":this.platform.getLayoutConfig().screen,
        "colorScheme":this.platform.getConfig().colorScheme,
        "contentSizeCategory":this.platform.getConfig().contentSizeCategory,
        "insets":this.platform.getLayoutConfig().insets,
        "statusBar":this.platform.getLayoutConfig().statusBar,
        "navigationBar":this.platform.getLayoutConfig().navigationBar
      }
      Logger.info(' Installed Unistyles \uD83E\uDD84!')
      this.isCxxReady = true;
    } catch (e) {
      this.isCxxReady = false;
      data = {"status":false}
    }

    return data;
  }

  time;
  private onRNUnistylesEvent(){
    //colorMode change
    let envCallback: EnvironmentCallback = {
      onConfigurationUpdated: (config) => {
        if (this.isCxxReady)
          return;

        if(this.time){
          clearInterval(this.time);
        }
        this.time = setInterval(()=>{
          const colorMode = this.colorModeToJSColorScheme(config.colorMode);
          if(this.platform.getConfig().colorScheme != colorMode){
            this.platform.getConfig().colorScheme = colorMode;
            this.ctx.rnInstance.postMessageToCpp("Unistyles::nativeOnAppearanceChange", [this.platform.getConfig().colorScheme]);
          }
          const fontScale = UnistylesConfig.getContentSizeCategory((config.fontSizeScale));
          if(this.platform.getConfig().contentSizeCategory != fontScale){
            this.platform.getConfig().contentSizeCategory == fontScale;
            this.ctx.rnInstance.postMessageToCpp("Unistyles::nativeOnContentSizeCategoryChange", [this.platform.getConfig().contentSizeCategory]);
          }
        },10);
      },
      onMemoryLevel: () => {
        //we need this empty callback, otherwise it won't compile
      }
    };
    const applicationContext = this.ctx.uiAbilityContext.getApplicationContext();
    applicationContext.on('environment', envCallback);

    //orientation change
    let listener: mediaquery.MediaQueryListener = mediaquery.matchMediaSync('(orientation: landscape)')
    listener.on('change',(data:mediaquery.MediaQueryResult) => {
      if (this.isCxxReady)
        return;
      if (data.matches as boolean) {
        this.direction = 'landscape';
      } else {
        this.direction = 'vertical';
      }

      if(this.direction == 'landscape' && data.matches as boolean === true ||
        this.direction == 'vertical' && data.matches as boolean === false){

      }else {
        //更新宽高和inset
        if(this.platform.hasNewLayoutConfig()){
          this.ctx.rnInstance.postMessageToCpp("Unistyles::nativeOnOrientationChange",
                                              {screenDimensions:this.platform.getLayoutConfig().screen,
                                                statusBarDimensions:this.platform.getLayoutConfig().statusBar,
                                                screenInsets:this.platform.getLayoutConfig().insets,
                                                navigationBarDimensions:this.platform.getLayoutConfig().navigationBar});
        }
      }
    })
  }

  ContentSizeCategoryChange(contentSizeCategory: String) {
    let a = {'type':'dynamicTypeSize',
      'payload': { 'contentSizeCategory':contentSizeCategory }
    }
    this.ctx.rnInstance.emitDeviceEvent('__unistylesOnChange',a);
  }

  setNavigationBarColor(color: string) {
    let SystemBarProperties: window.SystemBarProperties = { navigationBarColor: color };
    window.getLastWindow(this.context)
      .then((data) =>{
        try {
          data.setWindowSystemBarProperties(SystemBarProperties, (err: BusinessError) => {
            const errCode: number = err.code;
            if (errCode) {
              Logger.error("Unistyles", "Failed to set navigation bar color: "+color);
              return;
            }
          });
        } catch (exception) {
          Logger.error("Unistyles", "Failed to set navigation bar color: "+color);
        }
      });
  }

  setStatusBarColor(color:string){
    let SystemBarProperties: window.SystemBarProperties = { statusBarColor: color };
    window.getLastWindow(this.context)
      .then((data) =>{
        try {
          data.setWindowSystemBarProperties(SystemBarProperties, (err: BusinessError) => {
            const errCode: number = err.code;
            if (errCode) {
              Logger.error("Unistyles", "Failed to set status bar color: "+color);
              return;
            }
          });
        } catch (exception) {
          Logger.error("Unistyles", "Failed to set status bar color: "+color);
        }
      });
  }

  private colorModeToJSColorScheme(colorMode: ConfigurationConstant.ColorMode): JSColorScheme {
    if (colorMode === ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT) {
      return 'light'
    } else if (colorMode === ConfigurationConstant.ColorMode.COLOR_MODE_DARK) {
      return 'dark';
    } else {
      return null;
    }
  }
}

type JSColorScheme = 'light' | 'dark' | null;
export interface UnistylesBreakpoints {
  landscape?: number,
  portrait?: number,
}