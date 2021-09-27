import styled from 'styled-components';
import { typeStyle } from '../../../styles/typeStyle';

export const StyledParagraph = styled.p`
  ${typeStyle.paragraph};
  font-weight: 100;

  & + & {
    margin-bottom: 20px;
  }

  code {
    font-size: 0.75em;
  }
`;
