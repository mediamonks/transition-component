import styled from 'styled-components';
import { aspectRatio } from '../../../styles/helpers/aspectRatio';

export const StyledFullScreenImageBlock = styled.div`
  ${aspectRatio([16, 9])};
  position: relative;
  width: 100vw;
  overflow: hidden;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
