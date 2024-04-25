import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { AppConfigContext } from 'contexts';

const Nav = styled.nav`
  background: #333;
  color: white;
  padding: 1rem;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: flex-start;
`;

const NavItem = styled.li`
  margin-right: 1rem;
`;

const StyledNavLink = styled(NavLink)`
  color: white;
  text-decoration: none;

  &.active {
    font-weight: bold;
  }
`;

export const Navbar = () => {
    const appConfig = useContext(AppConfigContext); 
    return (
    <Nav>
      <NavList>
        <NavItem key={'home'}>
            <StyledNavLink to={'/'} activeclassname="active">
              Home
            </StyledNavLink>
          </NavItem>
        {appConfig.appPages.map((page) => (
          <NavItem key={page.pageName}>
            <StyledNavLink to={page.url} activeclassname="active">
              {page.pageName}
            </StyledNavLink>
          </NavItem>
        ))}
      </NavList>
    </Nav>
  );
};