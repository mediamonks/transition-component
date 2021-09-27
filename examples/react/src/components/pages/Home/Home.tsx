import { ReactElement } from 'react';
import Heading from '../../atoms/Heading/Heading';
import { StyledHome } from './Home.styles';

export default function Home(): ReactElement {
  return (
    <StyledHome>
      <Heading className="home-heading">Home</Heading>
    </StyledHome>
  );
}
