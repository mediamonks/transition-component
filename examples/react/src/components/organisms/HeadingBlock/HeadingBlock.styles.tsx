import styled from 'styled-components';
import Heading from '../../atoms/Heading/Heading';

export const StyledHeadingBlock = styled.div<{$backgroundColor?: string}>`
  height: 50vh;
  width: 100vw;
  
  ${(props) => props.$backgroundColor && `
    background-color: ${props.$backgroundColor};
  `}
`;

export const StyledHeading = styled(Heading)`
  margin: 100px 0 0;
  padding: 20px 40px;
`;
