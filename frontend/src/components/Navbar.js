import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";

const Navbar = () => {
  const NavLinks = [
    {
      id: 1,
      name: "Home",
      link: "/",
    },
    {
      id: 2,
      name: "For You",
      link: "/about",
    },
    {
      id: 3,
      name: "FAQ",
      link: "/faq",
    },
    {
      id: 4,
      name: "Sign",
      link: "/sign",
      invisible: localStorage.token,
    },
    {
      id: 5,
      name: "Bond Market",
      link: "/market",
      invisible: !localStorage.token,
    },
    {
      id: 6,
      name: "Fund",
      link: "/fund",
      invisible: !localStorage.token,
    },
    {
      id: 7,
      name: "Profile",
      link: "/profile",
      invisible: !localStorage.token,
    },
    {
      id: 8,
      name: "TestUI",
      link: "/testui",
	  invisible: !localStorage.token,
    },
  ];

  return (
    <Container>
      <Nav>
        <h3>
          <Link to="/" style={{ fontFamily: "Georgia, serif" }}>
            <Logo /> Bondzapp
          </Link>
        </h3>

        <NavList>
          {NavLinks.map((item, index) => {
            if (item.invisible) return null;
            return (
              <NavItem key={index}>
                <Link to={item.link} style={{ fontFamily: "Georgia, serif" }}>
                  <span style={{ fontFamily: "Georgia, serif" }}>{item.name}</span>
                </Link>
              </NavItem>
            );
          })}
        </NavList>
      </Nav>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: transparent;
  background-color: rgba(255, 255, 255, 0.05);
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  z-index: 200;
  font-family: "Georgia, serif";
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1128px;
  margin: 0 auto;
  padding: 15px 0;
  font-family: "Georgia, serif";

  h3 {
    font-size: 40px;
    margin: 0;
	text-align: center;
    font-family: "Georgia, serif";
  }
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: "Georgia, serif";
`;

const NavItem = styled.li`
  a {
    text-decoration: none;
    color: #000;
    font-size: 20px;
    font-weight: 500;
    padding: 0 10px;
    cursor: pointer;
    color: #fff;
    font-family: "Georgia, serif";
    &:hover {
      color: #0073b1;
    }
  }
`;

export default Navbar;