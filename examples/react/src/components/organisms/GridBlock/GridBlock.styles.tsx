import styled from 'styled-components';

export const StyledGridBlock = styled.div<{$backgroundColor?: string}>`
  display: flex;
  flex-wrap: wrap;
  width: 100vw;
  
  ${(props) => props.$backgroundColor && `
    background-color: ${props.$backgroundColor};
  `}
`;

export const StyledBlock = styled.div<{$backgroundColor?: string}>`
  width: 4.5%;
  margin: 0.25%;

  &::before {
    content: '';
    display: block;
    padding-top: 100%;
    filter: brightness(85%);
    
    ${(props) => props.$backgroundColor && `
      background-color: ${props.$backgroundColor};
    `}
  }
`;
