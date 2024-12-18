/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

import { RNPackage, TurboModulesFactory, DescriptorWrapperFactoryByDescriptorType, DescriptorWrapperFactoryByDescriptorTypeCtx } from '@rnoh/react-native-openharmony/ts';
import type { TurboModule, TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import { RNC,TM } from '@rnoh/react-native-openharmony/generated/ts'
import { RNUnistylesTurboModule } from './RNUnistylesTurboModule';

class RNUnistylesTurboModuleFactory extends TurboModulesFactory {
  createTurboModule(name: string): TurboModule | null {
    if (this.hasTurboModule(name)) {
        return new RNUnistylesTurboModule(this.ctx);
    }
    return null;
  }

  hasTurboModule(name: string): boolean {
    return name === "Unistyles";
  }
}

export class RNUnistylesPackage extends RNPackage {
  createTurboModulesFactory(ctx: TurboModuleContext): TurboModulesFactory {
    return new RNUnistylesTurboModuleFactory(ctx);
  }
}