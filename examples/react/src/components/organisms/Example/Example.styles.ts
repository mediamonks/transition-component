import styled from 'styled-components';
import { Paragraph } from '../../atoms/Paragraph/Paragraph';

export const StyledExample = styled.div`
  max-width: 1000px;
  margin: 100px auto;
`;

export const StyledCaption = styled(Paragraph)`
  margin-top: 40px;
  letter-spacing: 0.5px;
  color: ${(props) => props.theme.example.captionColor};
`;
