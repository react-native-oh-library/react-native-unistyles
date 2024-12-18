/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

import common from '@ohos.app.ability.common';
import { UnistylesInsets,Insets } from './Insets';
import { ConfigurationConstant } from '@kit.AbilityKit';
import display from '@ohos.display';
import { DisplayMetrics, PhysicalPixels, TurboModuleContext } from '@rnoh/react-native-openharmony/ts';


export class UnistylesConfig{
  private context: common.UIAbilityContext
  private ctx :TurboModuleContext
  constructor(context: common.UIAbilityContext,ctx :TurboModuleContext) {
    this.context = context;
    this.ctx = ctx;
    this.windowPhysicalPixels = this.ctx.getDisplayMetrics().windowPhysicalPixels;

    this.insets = new UnistylesInsets(this.context,ctx.safeAreaInsetsProvider.safeAreaInsets,this.windowPhysicalPixels.scale);
    this.lastLayoutConfig = this.getAppLayoutConfig();
    this.lastConfig = this.getAppConfig()
  }

  private windowPhysicalPixels: PhysicalPixels;
  private insets: UnistylesInsets;
  private lastConfig: Config;
  private lastLayoutConfig: LayoutConfig;

  hasNewConfig(): Boolean {
    let newConfig = this.getAppConfig()
    let newContentSizeCategory = newConfig.contentSizeCategory != this.lastConfig.contentSizeCategory
    let newColorScheme = newConfig.colorScheme != this.lastConfig.colorScheme

    if (!newContentSizeCategory && !newColorScheme) {
      return false
    }

    this.lastConfig = newConfig
    return true
  }

  hasNewLayoutConfig() {
    let newConfig = this.getAppLayoutConfig()
    
    if (newConfig == this.lastLayoutConfig) {
      return false
    }
    
    this.lastLayoutConfig = newConfig
    return true
  }

  getConfig(): Config {
    return this.lastConfig
  }

  getLayoutConfig(): LayoutConfig {
    return this.lastLayoutConfig
  }

  private getAppConfig(): Config {
    return new Config(
      this.getColorScheme(),
      UnistylesConfig.getContentSizeCategory(display.getDefaultDisplaySync().scaledDensity)
    )
  }

  private getAppLayoutConfig() {
    let screenWidth = (this.windowPhysicalPixels.width/this.windowPhysicalPixels.scale )
    let screenHeight = (this.windowPhysicalPixels.height/this.windowPhysicalPixels.scale )

    return new LayoutConfig(
      new Dimensions(screenWidth, screenHeight),
      this.insets.get(),
      new Dimensions(screenWidth, this.getStatusBarHeight()),
      new Dimensions(screenWidth, this.getNavigationBarHeight())
    )
  }

  public static getContentSizeCategory(fontScale: number): string {
    let contentSizeCategory:string;
    if(fontScale <= 0){
      contentSizeCategory = "Unspecified";
    }else if(fontScale <= 1){
      contentSizeCategory = "ExtraSmall";
    }else if(fontScale <= 2){
      contentSizeCategory = "Small";
    }else if(fontScale <= 3){
      contentSizeCategory = "Medium";
    }else if(fontScale <= 4){
      contentSizeCategory = "Large";
    }else if(fontScale <= 5){
      contentSizeCategory = "ExtraLarge";
    }else if(fontScale <= 6){
      contentSizeCategory = "ExtraExtraLarge";
    }else if(fontScale <= 7){
      contentSizeCategory = "ExtraExtraExtraLarge";
    }else if(fontScale <= 8){
      contentSizeCategory = "AccessibilityMedium";
    }else if(fontScale <= 9){
      contentSizeCategory = "AccessibilityLarge";
    }else if(fontScale <= 0){
      contentSizeCategory = "AccessibilityExtraLarge";
    }else if(fontScale <= 11){
      contentSizeCategory = "AccessibilityExtraExtraLarge";
    }else {
      contentSizeCategory = "AccessibilityExtraExtraExtraLarge";
    }

    return contentSizeCategory
  }

  private getColorScheme(): string {
    switch (this.context.config.colorMode){
      case ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET: return "unspecified";
      case ConfigurationConstant.ColorMode.COLOR_MODE_DARK: return "dark";
      case ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT: return "light";
      default: return "unspecified";
    }
  }

  private getStatusBarHeight() {
    let height:number = 0;
    height = this.ctx.safeAreaInsetsProvider.safeAreaInsets.top/this.ctx.getDisplayMetrics().screenPhysicalPixels.scale;
    return height;
  }

  private getNavigationBarHeight(){
    let height:number = 0;
    height = this.ctx.safeAreaInsetsProvider.safeAreaInsets.bottom/this.ctx.getDisplayMetrics().screenPhysicalPixels.scale;
    return height;
  }
}

export class LayoutConfig{
  screen:Dimensions;
  insets:Insets;
  statusBar:Dimensions;
  navigationBar:Dimensions;

  constructor(screen: Dimensions, insets: Insets, statusBar: Dimensions, navigationBar: Dimensions) {
    this.screen = screen;
    this.insets = insets;
    this.statusBar = statusBar;
    this.navigationBar = navigationBar;
  }
  
  isEqual(screen:Dimensions,insets:Insets, statusBar:Dimensions, navigationBar:Dimensions):boolean{
    return this.screen.isEqual(screen) && this.insets.isEqual(insets) && this.statusBar.isEqual(statusBar) && this.navigationBar.isEqual(navigationBar)
  }
}
export class Dimensions{
  width:number;
  height:number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
  isEqual(b:Dimensions){
    return this.width == b.width && this.height == b.height;
  }
}

export class Config{
  colorScheme:string;
  contentSizeCategory:string;
  constructor(colorScheme:string,contentSizeCategory:string) {
    this.colorScheme = colorScheme;
    this.contentSizeCategory = contentSizeCategory;
  }
}
