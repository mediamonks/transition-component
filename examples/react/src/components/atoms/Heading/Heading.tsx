import type { ReactElement, ReactNode } from 'react';
import React, { forwardRef } from 'react';

interface HeadingProps {
  children: ReactNode;
}

export default forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  {children, ...props}:HeadingProps, ref,): ReactElement {

  return (
    <h1
      ref={ref}
      style={{
        fontSize: '42px',
        color: 'black',
        margin: 20,
      }}
      {...props}
    >
      {children}
    </h1>
  );
});
