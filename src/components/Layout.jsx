import { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

import styled from "styled-components";
import { sizes } from "./../styles/styleguide";

import Footer from "./Footer";

export default function Layout({ title = "LEVR", children = null }) {
  useEffect(() => {
    setTimeout(() => {
      document.querySelector(".screen-loader").classList.add("hide-loader");
    }, 1000);
  });
  return (
    <LayoutStyling>
      <div className="screen-loader">
        <div className="screen-loader--text">LEVR.ly</div>
        <div className="screen-loader--loading"></div>
      </div>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="LEVR is a novel token that provides holders with leveraged exposure to the price of ETH, without risking a full default of the funds being leveraged."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="title" content={title} key="pagetitle" />
        <meta property="og:title" content={title} key="ogtitle" />
        <meta
          property="og:description"
          content="LEVR is a novel token that provides holders with leveraged exposure to the price of ETH, without risking a full default of the funds being leveraged."
          key="ogdescription"
        />
        <meta property="og:image" content="https://levr.ly/deth-logo-svg.svg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta
          name="twitter:description"
          content="LEVR is a novel token that provides holders with leveraged exposure to the price of ETH, without risking a full default of the funds being leveraged."
        />
        <meta
          name="twitter:image"
          content="https://levr.ly/deth-logo-svg.svg"
        />
      </Head>

      <StyledMain>{children}</StyledMain>

      <Footer />
    </LayoutStyling>
  );
}

const StyledLogo = styled.img`
  height: 3.5em;
  width: 3.5em;
  padding: 0.5714em;
`;

const StyledLogoText = styled.strong`
  font-weight: bold;
  a {
    text-decoration: none;
    font-size: 1.875em;
    line-height: 1.2333em;
  }
`;

const StyledHeaderContent = styled.div`
  max-width: ${sizes.container};
  margin: auto;
  width: 100%;
`;

const StyledFooter = styled.footer`
  width: 100%;
  padding: 2em 0;
  border-top: none;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const StyledFooterLogo = styled.div`
  font-size: 1.875em;
  line-height: 1.5333em;
  font-weight: bold;
`;

const StyledMain = styled.main`
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 100%;
`;
const LayoutStyling = styled.div`
  min-height: 100vh;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
