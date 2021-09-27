import { createGlobalStyle } from 'styled-components';
import type { AppTheme } from './App.styles';

// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
