const calculateRatio = (aspectRatio: readonly [number, number]) =>
  (aspectRatio[1] / aspectRatio[0]) * 100;

export const aspectRatio = (
  // eslint-disable-next-line no-shadow
  aspectRatio: readonly [number, number],
  position = 'relative',
): string => `
  &::before {
    content: "";
    display: block;
    position: ${position};
    padding-top: ${calculateRatio(aspectRatio)}%;
  }
`;
