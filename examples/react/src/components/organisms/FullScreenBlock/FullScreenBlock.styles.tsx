import styled from 'styled-components';

export const StyledFullScreenBlock = styled.div<{$backgroundColor?: string}>`
  height: 100vh;
  width: 100vw;
  
  ${(props) => props.$backgroundColor && `
    background-color: ${props.$backgroundColor};
  `}
`;
