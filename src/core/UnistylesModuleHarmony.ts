import { NativeEventEmitter, NativeModules,TurboModuleRegistry } from 'react-native'
import type { UnistylesThemes, UnistylesBreakpoints } from 'react-native-unistyles'
import type { ColorSchemeName, ScreenInsets, StatusBar, NavigationBar } from '../types'
import { normalizeWebStylesPlugin } from '../plugins'

export class UnistylesBridgeHarmony {
    _module = TurboModuleRegistry ? TurboModuleRegistry.get('Unistyles') : NativeModules.Unistyles;
    timerRef?: ReturnType<typeof setTimeout> = undefined
    hasAdaptiveThemes: boolean = true
    supportsAutomaticColorScheme = false
    screenWidth = 0
    screenHeight = 0
    themes: Array<keyof UnistylesThemes> = []
    breakpoints: UnistylesBreakpoints = {} as UnistylesBreakpoints
    colorScheme: ColorSchemeName
    themeName: keyof UnistylesThemes = '' as keyof UnistylesThemes
    enabledPlugins: Array<string> = [normalizeWebStylesPlugin.name]
    unistylesEvents = new NativeEventEmitter(this._module)
    sortedBreakpointPairs: Array<[keyof UnistylesBreakpoints, number]> = []
    breakpoint: keyof UnistylesBreakpoints = '' as keyof UnistylesBreakpoints
    contentSizeCategory: string = 'unspecified'
    insets: ScreenInsets = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }
    statusBar: StatusBar = {
        height: 0,
        width: 0,
        setColor: (color) => { this._module.setStatusBarColor(color); }
    }
    navigationBar: NavigationBar = {
        height: 0,
        width: 0,
        setColor: (color) => { this._module.setNavigationBarColor(color); }
    }

    constructor() {
        //参数赋值
        let data = this._module.install();

        global.__UNISTYLES__ = data;
        this.screenWidth = data.screen.width
        this.screenHeight = data.screen.height
        this.colorScheme = data.colorScheme
        this.contentSizeCategory = data.contentSizeCategory
        this.insets.top = data.insets.top;
        this.insets.right = data.insets.right;
        this.insets.bottom = data.insets.bottom;
        this.insets.left = data.insets.left;

        this.navigationBar.height = data.navigationBar.height;
        this.navigationBar.width = data.navigationBar.width;
        this.statusBar.height = data.statusBar.height;
        this.statusBar.width = data.statusBar.width;
        this.setupListeners();
    }

    public useTheme(themeName: keyof UnistylesThemes) {
        this.themeName = themeName
        this.emitThemeChange()
    }

    public updateTheme(themeName: keyof UnistylesThemes) {
        if (!this.themeName) {
            this.themeName = this.getTheme()
        }

        if (this.themeName === themeName) {
            this.emitThemeChange()
        }
    }

    public useBreakpoints(breakpoints: UnistylesBreakpoints) {
        this.breakpoints = breakpoints
        this.sortedBreakpointPairs = Object
            .entries(breakpoints)
            .sort(([, a], [, b]) => (a ?? 0) - (b ?? 0)) as Array<[keyof UnistylesBreakpoints, number]>

        this.breakpoint = this.getBreakpointFromScreenWidth(this.screenWidth as number)
    }

    public useAdaptiveThemes(enable: boolean) {
        this.hasAdaptiveThemes = enable
        if (!this.hasAdaptiveThemes) {
            return
        }

        if (this.themeName !== this.colorScheme) {
            this.themeName = this.colorScheme as keyof UnistylesThemes
            this.emitThemeChange()
        }
    }

    public addPlugin(pluginName: string, notify: boolean) {
        this.enabledPlugins = [pluginName].concat(this.enabledPlugins)

        if (notify) {
            this.emitPluginChange()
        }
    }

    public removePlugin(pluginName: string) {
        this.enabledPlugins = this.enabledPlugins.filter(name => name !== pluginName)
        this.emitPluginChange()
    }

    public getTheme(): keyof UnistylesThemes {
        if (this.themes.length === 1) {
            return this.themes.at(0) as keyof UnistylesThemes
        }

        return this.themeName
    }
    public setupListeners() {
        this.unistylesEvents.addListener(
            '___unistylesOnChange',
            (event) => {
                switch (event.type) {
                    case "screenChange": {
                        clearTimeout(this.timerRef)
                        this.timerRef = setTimeout(() => {
                            this.screenWidth = event.payload.width
                            this.screenHeight = event.payload.height
                            this.breakpoint = this.getBreakpointFromScreenWidth(this.screenWidth)
                            this.emitLayoutChange()
                        }, 100)
                        return 
                    }
                    case "colorSchemeChange": {
                        this.colorScheme = event.payload.colorScheme
                        if (!this.hasAdaptiveThemes) {
                            return
                        }
            
                        if (this.colorScheme !== this.themeName) {
                            this.themeName = this.colorScheme as keyof UnistylesThemes
                            this.emitThemeChange()
                        }
                    }
                    case "orientationChange":{
                        this.screenWidth = event.payload.screen.width
                        this.screenHeight = event.payload.screen.height
                        this.insets.left = event.payload.insets.left
                        this.insets.bottom = event.payload.insets.bottom
                        this.insets.right = event.payload.insets.right
                        this.insets.top = event.payload.insets.top
                        this.emitLayoutChange()
                    }
                    default:
                        return
                }
            }
        )
    }

    public getBreakpointFromScreenWidth(width: number): keyof UnistylesBreakpoints {
        const breakpoint = this.sortedBreakpointPairs
            .find(([, value], index, otherBreakpoints) => {
                const minVal = value
                const maxVal = otherBreakpoints[index + 1]?.[1]

                if (!maxVal) {
                    return true
                }

                return width >= minVal && width < maxVal
            })

        return breakpoint?.at(0) as keyof UnistylesBreakpoints
    }

    public emitPluginChange() {
        this._module.pluginChange();
    }

    public emitThemeChange() {
        this._module.themeChange(this.themeName);
    }

    public emitLayoutChange() {
        this._module.themeChange(
            this.breakpoint,
            (this.screenWidth as number) > (this.screenHeight as number)? 'landscape': 'portrait',
            {
                width: this.screenWidth,
                height: this.screenHeight
            },
            this.statusBar,
            this.insets,
            this.navigationBar
        );
    }

}

export const UnistylesModule_h = new UnistylesBridgeHarmony()
