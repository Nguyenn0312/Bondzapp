import React from 'react';
import styled from 'styled-components';
export const Logo = () => {
    return (
      <StyledLink
        href="/"
        aria-label="BondZapp"
        title="BondZapp"
      >
        <StyledSvg
          viewBox="0 0 24 24"
          strokeLinejoin="round"
          strokeWidth="2"
          strokeLinecap="round"
          strokeMiterlimit="10"
          stroke="currentColor"
          fill="none"
        >
         <Rect1 x="3" y="1" width="7" height="12" />
         <Rect2 x="3" y="17" width="7" height="6" />
         <Rect3 x="14" y="1" width="7" height="6" />
         <Rect4 x="14" y="11" width="7" height="12" />
        </StyledSvg>
        <StyledSpan>
          {/*BondZapp*/}
        </StyledSpan>
      </StyledLink>
    );
  };
  
  export default Logo;


  const Rect1 = styled.rect`
  fill: none;
  stroke: #B90E50;
`;

const Rect2 = styled.rect`
  fill: none;
  stroke: 	#FFFFFF;
`;
const Rect3 = styled.rect`
  fill: none;
  stroke: 	#FFFFFF;
`;
const Rect4 = styled.rect`
  fill: none;
  stroke: #D92525; 
`;
const StyledLink = styled.a`
  text-decoration: none;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
`;

const StyledSvg = styled.svg`
  width: 40px;
  height: 40px;
  margin-right: 8px;
`;

const StyledSpan = styled.span`
  font-size: 1.75rem;
  font-weight: bold;
`;
