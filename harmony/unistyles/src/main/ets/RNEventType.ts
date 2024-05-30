import { Insets } from './Insets';
import {Dimensions} from './Config'
import {UnistylesBreakpoints} from './RNUnistylesTurboModule'


export enum RNUnistylesEventType {
  Theme = 'theme',
  Layout = 'layout',
  Plugin = 'plugin',
  ContentSizeCategory = "contentSizeCategory",
}
export type RNUnistylesThemeEvent = {
  type: RNUnistylesEventType.Theme,
  payload: {
    themeName: string
  }
}
export type RNUnistylesLayoutEvent = {
  type: RNUnistylesEventType.Layout,
  payload: {
    breakpoint: UnistylesBreakpoints, orientation: string, screen: Dimensions, statusBar: Dimensions, insets: Insets, navigationBar: Dimensions
  }
}
export type RNUnistylesPluginEvent = {
  type: RNUnistylesEventType.Plugin,

}
export type RNUnistylesContentSizeCategoryEvent = {
  type: RNUnistylesEventType.ContentSizeCategory,
  payload: {
    contentSizeCategory: string
  }
}


export type RNUnistylesEvents = RNUnistylesThemeEvent |RNUnistylesContentSizeCategoryEvent|RNUnistylesPluginEvent|RNUnistylesLayoutEvent