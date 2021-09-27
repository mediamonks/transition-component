import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const StyledNavigation = styled.div`
  display: grid;
  grid-template-areas: 'a . b b';
  gap: 20px;
  padding: 30px 60px;
  color: ${(props) => props.theme.navigation.color};
  background: ${(props) => props.theme.navigation.background};
  max-width: 1400px;
  margin: 0 auto;
`;

export const StyledLogo = styled.div`
  width: 34px;
  height: 34px;
  background: #fff;
  grid-area: a;
`;

export const StyledNav = styled.nav`
  grid-area: b;
  display: grid;
  gap: 60px;
  grid-auto-flow: column;
  place-items: center center;
  place-content: center end;
`;

export const StyledNavLink = styled(Link)`
  font-weight: bold;
  text-decoration: none;
  color: ${(props) => props.theme.navigation.color};
`;

export const StyledNavAnchor = styled.a`
  display: inline-block;
  text-decoration: none;
  font-weight: bold;
  padding: 7px 20px;
  margin: -7px 0;
  border-radius: 100vw;
  background: ${(props) => props.theme.navigation.color};
  color: ${(props) => props.theme.navigation.background};
`;
