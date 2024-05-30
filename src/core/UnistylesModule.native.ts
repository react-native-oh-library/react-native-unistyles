import { NativeModules,Platform,TurboModuleRegistry } from 'react-native'

type UnistylesNativeModule = {
    install(): boolean
}

export const UnistylesModule = NativeModules?.Unistyles as UnistylesNativeModule
