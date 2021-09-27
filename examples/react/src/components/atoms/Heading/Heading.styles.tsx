import styled from 'styled-components';

export const StyledHeading = styled.h1`
  display: grid;
  place-items: center start;

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
