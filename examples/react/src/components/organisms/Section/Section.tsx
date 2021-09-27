import { ReactElement, ReactNode } from 'react';
import { StyledSection } from './Section.styles';

interface SectionProps {
  children: ReactNode;
}

export function Section({ children }: SectionProps): ReactElement {
  return <StyledSection>{children}</StyledSection>;
}
