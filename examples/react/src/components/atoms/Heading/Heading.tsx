import { forwardRef, ReactElement, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { HeadingType } from './Heading.data';
import { StyledHeading, StyledHeadingButton } from './Heading.styles';

interface HeadingProps {
  as?: HeadingType;
  className?: string;
  children: ReactNode;
}

export default forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { children, as = HeadingType.H1, ...props }: HeadingProps,
  ref,
): ReactElement {
  let id;

  if (typeof children === 'string') {
    id = children
      .replace(/[^\w\s]/gi, '')
      .trim()
      .replace(/\s/gi, '-');
  }

  return (
    <StyledHeading ref={ref} $type={as} {...props} id={id}>
      {id ? <Link to={`#${id}`}>{children}</Link> : children}
    </StyledHeading>
  );
});
