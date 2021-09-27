import styled from 'styled-components';
import { HeadingType } from './Heading.data';
import { typeStyle } from '../../../styles/typeStyle';
import { FontFamily, FontWeight } from '../../../styles/variables';

export const StyledHeading = styled.h1<{ $type: HeadingType }>`
  ${({ $type }) => typeStyle[$type]};
  font-family: ${FontFamily.SystemNeue};
  font-weight: ${FontWeight.SemiBold};
  display: grid;
  place-items: center start;
  position: relative;

  h2&,
  .h2 {
    font-size: 56px;
  }

  h3&,
  .h3 {
    font-size: 36px;
  }

  > div:not(:first-child) {
    position: absolute;
  }
`;

export const StyledHeadingButton = styled.span`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(calc(-100% - 20px), -50%);
  font-size: 12px;
`;
