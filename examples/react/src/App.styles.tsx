import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const StyledNav = styled.nav`
  height: 80px;
  padding: 10px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f2f2f2;
  border-bottom: 1px solid #dddcdc;
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.08);
`;

export const StyledNavLink = styled(NavLink)`
  font-size: 18px;
  text-decoration: none;
  color: black;
  
  &:not(:first-child) {
    margin-left: 30px;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;
