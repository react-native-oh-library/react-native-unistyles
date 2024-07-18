import { NativeModules,TurboModuleRegistry } from 'react-native'

type UnistylesNativeModule = {
    install(): boolean
}

export const UnistylesModule = TurboModuleRegistry ? TurboModuleRegistry.get('Unistyles') : NativeModules.Unistyles as UnistylesNativeModule
