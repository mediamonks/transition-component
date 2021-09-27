import styled from 'styled-components';

export const StyledParagraph = styled.p`
  font-size: 18px;
  line-height: 32px;

  & + & {
    margin-bottom: 20px;
  }

  code {
    display: inline-block;
    position: relative;
    font-weight: bold;
    top: -1px;
    font-size: 16px;
    margin: 0 8px;
    color: ${(props) => props.theme.app.codeColor};

    &::before {
      content: '';
      position: absolute;
      z-index: -1;
      top: 6px;
      bottom: 3px;
      left: -6px;
      right: -6px;
      border-radius: 6px;
      background: ${(props) => props.theme.app.codeBackground};
    }
  }
`;
