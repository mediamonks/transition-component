import { ReactElement, ReactNode } from 'react';
import { StyledParagraph } from './Paragraph.styles';

interface ParagraphProps {
  children: ReactNode;
  className?: string;
}

export function Paragraph({ children, className }: ParagraphProps): ReactElement {
  return <StyledParagraph className={className}>{children}</StyledParagraph>;
}
