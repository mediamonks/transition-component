import { css, FlattenSimpleInterpolation } from 'styled-components';
import { HeadingType } from '../components/atoms/Heading/Heading.data';
import { fluidType } from './helpers/fluidType';
import { respondTo } from './helpers/respondTo';
import { MediaQuery } from './mediaQuery';

type TypeStyles = HeadingType | 'paragraph';

export const typeStyle: Record<TypeStyles, FlattenSimpleInterpolation> = {
  [HeadingType.H1]: css`
    ${fluidType(48, 72)};
    line-height: 1;

    @media ${respondTo(MediaQuery.Medium)} {
      line-height: 1;
    }
  `,
  [HeadingType.H2]: css`
    ${fluidType(32, 56)};
    line-height: 1;
  `,
  [HeadingType.H3]: css`
    ${fluidType(24, 32)};
    line-height: 1.11;
  `,
  [HeadingType.H4]: css`
    ${fluidType(24, 32)};
    line-height: 1.11;
  `,
  'paragraph': css`
    ${fluidType(14, 16)};
    line-height: 2;
  `,
} as const;

export type TypeStyleType = typeof typeStyle;
