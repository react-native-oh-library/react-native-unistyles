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
  createDescriptorWrapperFactoryByDescriptorType(ctx: DescriptorWrapperFactoryByDescriptorTypeCtx): DescriptorWrapperFactoryByDescriptorType {
    return { [RNC.GeneratedSampleViewArkTS.NAME]: (ctx2) => new RNC.GeneratedSampleViewArkTS.DescriptorWrapper(ctx2.descriptor) }
  }
}