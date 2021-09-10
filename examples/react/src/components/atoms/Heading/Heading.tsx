import type { ReactElement, ReactNode } from 'react';
import React, { forwardRef } from 'react';
import { StyledHeading } from './Heading.styles';

interface HeadingProps {
  className?: string;
  children: ReactNode;
}

export default forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { children, ...props }: HeadingProps,
  ref,
): ReactElement {
  return (
    <StyledHeading ref={ref} {...props}>
      {children}
    </StyledHeading>
  );
});
