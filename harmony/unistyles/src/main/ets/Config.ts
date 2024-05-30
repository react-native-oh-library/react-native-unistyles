import common from '@ohos.app.ability.common';
import { UnistylesInsets,Insets } from './Insets';
import { ConfigurationConstant } from '@kit.AbilityKit';
import display from '@ohos.display';
import { TurboModuleContext } from '@rnoh/react-native-openharmony/ts';


export class UnistylesConfig{
  private context: common.UIAbilityContext
  private ctx :TurboModuleContext
  constructor(context: common.UIAbilityContext,ctx :TurboModuleContext) {
    this.context =context;
    this.ctx =ctx;

    this.insets = new UnistylesInsets(this.context,ctx.safeAreaInsetsProvider.safeAreaInsets);
    this.lastLayoutConfig = this.getAppLayoutConfig();
    this.lastConfig = this.getAppConfig()
  }

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
      this.getContentSizeCategory(display.getDefaultDisplaySync().scaledDensity)
    )
  }

  private getAppLayoutConfig() {
    let a = this.ctx.getDisplayMetrics();
    let screenWidth = (a.screenPhysicalPixels.width/a.screenPhysicalPixels.scale )
    let screenHeight = (a.screenPhysicalPixels.height/a.screenPhysicalPixels.scale )

    return new LayoutConfig(
      new Dimensions(screenWidth, screenHeight),
      this.insets.get(),
      new Dimensions(screenWidth, this.getStatusBarHeight()),
      new Dimensions(screenWidth, this.getNavigationBarHeight())
    )
  }

  private getContentSizeCategory(fontScale: number): string {
    let contentSizeCategory:string;
    if(fontScale <= 0.85){
      contentSizeCategory = "Small";
    }else if(fontScale <= 1.0){
      contentSizeCategory = "Default";
    }else if(fontScale <= 1.15){
      contentSizeCategory = "Large";
    }else if(fontScale <= 1.3){
      contentSizeCategory = "ExtraLarge";
    }else if(fontScale <= 1.5){
      contentSizeCategory = "Huge";
    }else if(fontScale <= 1.8){
      contentSizeCategory = "ExtraHuge";
    }else{
      contentSizeCategory = "ExtraExtraHuge";
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
