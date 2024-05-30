import common from '@ohos.app.ability.common';
import { SafeAreaInsets } from '@rnoh/react-native-openharmony/ts';

export class UnistylesInsets {
  insets :Insets;

  constructor(context: common.UIAbilityContext,insets: SafeAreaInsets) {
    this.insets = new Insets(insets.top,insets.bottom,insets.left,insets.right);
    this.density = context.config.screenDensity;
  }

  private density: number;

  get() {
    return this.getCurrentInsets();
  }

  getCurrentInsets() {
    let topInset = this.insets.top/this.density //状态栏
    let bottomInset = this.insets.bottom/this.density//导航栏
    let leftInset = this.insets.left/this.density//
    let rightInset = this.insets.right/this.density//

    return new Insets(topInset, bottomInset, leftInset, rightInset)
  }

}

export class Insets{
  top:number;
  bottom:number;
  left:number;
  right:number;

  constructor(topInset: number, bottomInset: number, leftInset: number, rightInset: number) {
    this.top = topInset;
    this.bottom = bottomInset;
    this.left = leftInset;
    this.right = rightInset;
  }
  isEqual(b:Insets){
    return this.top == b.top && this.bottom == b.bottom && this.left == b.left && this.right == b.right;
  }
}