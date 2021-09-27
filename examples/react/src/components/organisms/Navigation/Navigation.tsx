import { ReactElement } from 'react';
import { Path } from '../../../routes/Path';
import {
  StyledLogo,
  StyledNav,
  StyledNavAnchor,
  StyledNavigation,
  StyledNavLink,
} from './Navigation.styles';

export function Navigation(): ReactElement {
  return (
    <StyledNavigation>
      <StyledLogo>RTC</StyledLogo>

      <StyledNav>
        <StyledNavLink to={Path.Home}>Home</StyledNavLink>
        <StyledNavLink to={Path.ApiDocumentation}>API Documentation</StyledNavLink>
        <StyledNavLink to={Path.Examples}>Examples</StyledNavLink>

        <StyledNavAnchor href="https://media.monks.com/careers" target="_blank">
          We're hiring!
        </StyledNavAnchor>
      </StyledNav>
    </StyledNavigation>
  );
}
