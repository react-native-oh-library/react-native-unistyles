/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

import {UnistylesConfig,LayoutConfig,Config} from './Config'

import common from '@ohos.app.ability.common';
import { TurboModuleContext } from '@rnoh/react-native-openharmony/ts';

export class Platform{
  reactApplicationContext: common.UIAbilityContext

  constructor(reactApplicationContext: common.UIAbilityContext,ctx :TurboModuleContext ) {
    this.reactApplicationContext = reactApplicationContext;
    this.config = new UnistylesConfig(reactApplicationContext,ctx);
  }
  private config: UnistylesConfig;

  defaultNavigationBarColor: number = null
  defaultStatusBarColor: number = null

  hasNewLayoutConfig(): Boolean {
    return this.config.hasNewLayoutConfig()
  }

  hasNewConfig(): Boolean {
    return this.config.hasNewConfig()
  }

  getConfig(): Config {
    return this.config.getConfig()
  }

  getLayoutConfig(): LayoutConfig {
    return this.config.getLayoutConfig()
  }
}