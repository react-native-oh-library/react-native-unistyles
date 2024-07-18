import { unistyles } from './core'
import { mq } from 'react-native-unistyles'
import { useInitialTheme } from 'react-native-unistyles'
import type { UnistylesPlugin, UnistylesValues } from 'react-native-unistyles'
import type { UnistylesThemes, UnistylesBreakpoints } from 'react-native-unistyles'
import { ScreenOrientation, AndroidContentSizeCategory, IOSContentSizeCategory } from 'react-native-unistyles'
import { useStyles } from 'react-native-unistyles'
import { createStyleSheet } from 'react-native-unistyles'

/**
 * Utility to interact with the Unistyles
 * (should be called only once)
 */
const UnistylesRegistry = {
    /**
     * Register themes to be used in the app
     * @param themes - Key value pair of themes
     */
    addThemes: unistyles.registry.addThemes,
    /**
     * Register breakpoints to be used in the app
     * @param breakpoints - Key value pair of breakpoints
     */
    addBreakpoints: unistyles.registry.addBreakpoints,
    /**
     * Register additional config to customize the Unistyles
     * @param config - Key value pair of config
     */
    addConfig: unistyles.registry.addConfig
}

const UnistylesRuntime = unistyles.runtime

export {
    mq,
    useStyles,
    useInitialTheme,
    createStyleSheet,
    ScreenOrientation,
    AndroidContentSizeCategory,
    IOSContentSizeCategory,
    UnistylesRegistry,
    UnistylesRuntime
}

export type {
    UnistylesThemes,
    UnistylesBreakpoints,
    UnistylesPlugin,
    UnistylesValues
}
