import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

interface UnistylesBreakpoints {
    landscape?: number,
    portrait?: number,
}

interface Dimensions{
    width:number;
    height:number;
}
interface Insets{
    top:number;
    bottom:number;
    left:number;
    right:number;
}

export interface Spec extends TurboModule {
    install: () => {};
    setStatusBarColor:(color:string) => void;
    setNavigationBarColor:(color:string) => void;
    pluginChange:() => void;
    themeChange:(themeName:string) => void;
    layoutChange:(breakpoint: UnistylesBreakpoints, orientation: string, screen: Dimensions, statusBar: Dimensions, insets: Insets, navigationBar: Dimensions) => void;
}

export default TurboModuleRegistry.get<Spec>('Unistyles') as Spec | null;
