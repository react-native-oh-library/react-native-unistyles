import { TurboModule,TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import { TM } from '@rnoh/react-native-openharmony/generated/ts'
import window from '@ohos.window';
import common from '@ohos.app.ability.common'
import { Insets, } from './Insets';
import { BusinessError } from '@ohos.base';
import {Platform} from './Platform'
import {Dimensions} from './Config'
import mediaquery from '@ohos.mediaquery';
import { RNUnistylesEvents,RNUnistylesEventType } from './RNEventType';
import Logger from './Logger';
import type EnvironmentCallback from '@ohos.app.ability.EnvironmentCallback';
import ConfigurationConstant from '@ohos.app.ability.ConfigurationConstant';

export class RNUnistylesTurboModule extends TurboModule implements TM.Unistyles.Spec {
  context: common.UIAbilityContext;
  ctx :TurboModuleContext;
  isCxxReady: Boolean = false;
  platform: Platform = null;

  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
    this.context = ctx.uiAbilityContext;
    this.onRNUnistylesEvent();
  }

  //横屏数据
  direction = 'horizontal';
  install(): any {
    this.platform = new Platform(this.context,this.ctx)

    let a = {"screen":this.platform.getLayoutConfig().screen,
      "colorScheme":this.platform.getConfig().colorScheme,
      "contentSizeCategory":this.platform.getConfig().contentSizeCategory,
      "insets":this.platform.getLayoutConfig().insets,
      "statusBar":this.platform.getLayoutConfig().statusBar,
      "navigationBar":this.platform.getLayoutConfig().navigationBar
    }
    this.context.cacheDir
    return a;
  }

  private onRNUnistylesEvent(){
    //属性变更事件监听
    this.ctx.rnInstance.subscribeToLifecycleEvents("WINDOW_SIZE_CHANGE",() => {
      let displayMetrics = this.ctx.getDisplayMetrics();
      this.ctx.rnInstance.emitDeviceEvent("didUpdateDimensions", displayMetrics);
      let a = {'type':'screenChange',"payload" :{ "width" : displayMetrics.windowPhysicalPixels.width,"height" : displayMetrics.windowPhysicalPixels.height } }
      this.ctx.rnInstance.emitDeviceEvent('___unistylesOnChange',a);
    })

    let envCallback: EnvironmentCallback = {
      onConfigurationUpdated: (config) => {
        const colorMode = config.colorMode;
        this.platform.getConfig().colorScheme = this.colorModeToJSColorScheme(colorMode);
        let a = {'type':'colorSchemeChange',"payload" :{ "colorScheme" : this.platform.getConfig().colorScheme } }
        this.ctx.rnInstance.emitDeviceEvent('___unistylesOnChange',a);
      },
      onMemoryLevel: () => {
        //we need this empty callback, otherwise it won't compile
      }
    };
    const applicationContext = this.ctx.uiAbilityContext.getApplicationContext();
    applicationContext.on('environment', envCallback);

    //横屏变更
    let listener: mediaquery.MediaQueryListener = mediaquery.matchMediaSync('(orientation: landscape)')
    listener.on('change',(data:mediaquery.MediaQueryResult) => {
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
          let a = {'type':'orientationChange',
            "payload" :{ "screen" : this.platform.getLayoutConfig().screen,
            "insets":this.platform.getLayoutConfig().insets} }
          this.ctx.rnInstance.emitDeviceEvent('___unistylesOnChange',a);
        }
      }
    })
  }

  layoutChange(breakpoint: UnistylesBreakpoints, orientation: String, screen: Dimensions, statusBar: Dimensions, insets: Insets, navigationBar: Dimensions) {
    let a = {'type':'layout',
      'payload':
      {
        'breakpoint':breakpoint,
        'orientation':orientation,
        'screen' :{'width':screen.width,'height':screen.height } ,
        'statusBar' :{'width':statusBar.width,'height':statusBar.height },
        'navigationBar' :{'width':navigationBar.width,'height':navigationBar.height },
        'insets':{ 'top':insets.top,'bottom':insets.bottom,'left':insets.left,'right':insets.right }
      }
    }
    this.ctx.rnInstance.emitDeviceEvent('__unistylesOnChange',a);
  }

  themeChange(themeName: String) {
    let a = {'type':'theme', 'payload': { 'themeName':themeName } }
    this.ctx.rnInstance.emitDeviceEvent('__unistylesOnChange',a);
  }

  pluginChange() {
    let a = {'type':'plugin' }
    this.ctx.rnInstance.emitDeviceEvent('__unistylesOnChange',a);
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