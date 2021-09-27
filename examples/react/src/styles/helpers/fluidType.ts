export const fluidType = (
  minFontSize: number,
  maxFontSize: number,
  minViewport = 480,
  maxViewport = 1440,
): string => `
  font-size: ${minFontSize / 10}rem;

  @media screen and (min-width: ${minViewport}px) {
    font-size: calc(
      ${minFontSize / 10}rem + ${maxFontSize - minFontSize} * (100vw - ${minViewport / 10}rem) /
        ${maxViewport - minViewport}
    );
  }

  @media screen and (min-width: ${maxViewport}px) {
    font-size: ${maxFontSize / 10}rem;
  }
`;
