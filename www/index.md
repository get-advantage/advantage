---
title: Advantage - Building User-First Ad Formats.
description: AdVantage is a set of mix and matchable highly performant web components that are easily customizable to meet your site functionality needs.
aside: false
sidebar: false
layout: page
---

<style>
  .homepage .container {
    max-width: 1280px;
    margin: auto;
    padding: 80px 24px;
  }

  .homepage .hero {
    align-items: center;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }

  .homepage .hero-heading {
    font-size: 90px;
    font-weight: 800;
    margin: 0;
    padding: 0;
    line-height: 1.15;
    text-align: center;
  }

  .homepage .hero-heading span {
    display: block
  }

  @keyframes gradient {
    0% {
      background-size: 50% 150%
    }

    100% {
      background-size: 100% 100%
    }
  }

  .homepage .heading-gradient {
    background: linear-gradient(120deg, #ef5350, #f48fb1, #7e57c2, #2196f3, #26c6da, #43a047, #eeff41, #f9a825, #ff5722);
    color: white;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: 1s gradient forwards;
  }

  .homepage .hero-subheading {
    margin-top: 25px;
    font-weight: 400;
    font-size: 24px;
    color: var(--vp-c-text-2);
    max-width: 600px;
    text-align: center;
    line-height: 1.5
  }

  .homepage .hero-actions {
    margin-top: 25px;
    margin-bottom: 40px;
    display: flex
  }

  .homepage .hero-action {
    margin: 0 6px;
    font-size: 18px;
    border-radius: 40px;
    padding: 14px 18px;
    display: inline-flex;
    font-weight: 600
  }

  .homepage .hero-action.primary {
    background: white;
    color: black
  }

  .homepage .hero-action.secondary {
    background: var(--vp-c-brand);
    color: white
  }

  .homepage .try-link-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .homepage .try-link {
    background-color: rgba(255,255,255,.3);
    -webkit-backdrop-filter: blur(10px);
    color: white;
    font-weight: 500;
    padding: 14px 20px;
    border-radius: 40px;
    opacity: 0;
    transition: all .25s linear;
    margin-top: -40px
  }

  .homepage .features {
    display: grid;
    grid-template-columns: repeat(4, 1fr)
  }

  .homepage .feature {
    display: flex;
    align-items: center
  }

  .homepage .feature-title {
    font-size: 20px;
    font-weight: 600
  }

  .homepage .feature-subtitle {
    color: var(--vp-c-text-2)
  }

  .homepage .feature-description {
    display: flex;
    flex-direction: column;
  }

  .homepage .feature-icon {
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .homepage .feature-icon img {
    width: auto;
    height: 50px
  }

  .homepage .quote {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 80px 0
  }

  .homepage blockquote {
    font-size: 42px;
    font-weight: 700;
    line-height: 1.2;
    max-width: 900px;
  }

  .homepage figcaption {
    color: var(--vp-c-text-2);
    margin-top: 15px;
    font-size: 18px
  }

  .homepage .section-title {
    display: block;
    text-align: center;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 40px;
    color: var(--vp-c-text-2)
  }

  .homepage .start-link {
    border-radius: 40px;
    padding: 4px;
    background: linear-gradient(120deg, #ef5350, #f48fb1, #7e57c2, #2196f3, #26c6da, #43a047, #eeff41, #f9a825, #ff5722);
    background-size: 100% 100%;
    background-repeat: repeat-y;
    display: inline-flex;
    transition: all 10s linear
  }

  .homepage .start-link a {
    background: var(--vp-c-bg);
    padding: 14px 20px;
    border-radius: 40px;
    font-size: 18px;
    font-weight: 600;
  }

  .homepage .start-link a:hover {
    background: transparent;
    color: rgba(0,0,0,.9);
  }

  .homepage .footer-text {
    text-align: center;
    margin-top: 80px;
    font-weight: 500;
    color: var(--vp-c-text-2)
  }

  .homepage .footer-text a {
    font-weight: 700;
  }

  @media screen and (max-width: 720px) {
    .homepage .container {
      padding: 40px 24px
    }

    .homepage video {
      margin-bottom: 40px
    }

    .homepage .quote {
      margin: 40px 0;
    }

    .homepage blockquote {
      font-size: 32px
    }

    .homepage .hero-heading {
      font-size: 55px
    }

    .homepage .hero-subheading {
      font-size: 20px
    }

    .homepage .features {
      grid-template-columns: 1fr
    }

    .homepage .footer-text {
      margin-top: 40px
    }
  }
</style>
<div class="homepage">
  <div class="container">
    <div class="hero">
      <h1 class="hero-heading">
        <span>High Impact Advertising</span>
        <span class="heading-gradient">Reimagined</span>
      </h1>
      <p class="hero-subheading">
        Advantage not only streamlines the process of integrating high-impact advertising formats into webpages but also embodies a broader mission: <i>to democratize high-impact web advertising for all stakeholders in the digital advertising ecosystem. </i>
      </p>
      <div class="hero-actions">
        <a href="./docs/" class="hero-action secondary">
          <span style="padding-right: 8px">Get started</span>
          <img src="/icons/chevron-right.svg" width="20" height="20" />
        </a>
        <a href="./docs" class="hero-action primary">
          <span style="padding-right: 8px">Documentation</span>
        </a>
      </div>
    </div>
  </div>
  <div style="background: var(--vp-c-bg-alt)">
    <div class="container">
      <!-- <span class="section-title">Features</span> -->
      <div class="features">
        <div class="feature">
          <div class="feature-icon">
            <img src="/icons/html5.svg">
          </div>
          <div class="feature-description">
            <span class="feature-title">Web Components</span>
            <span class="feature-subtitle">Reusable, encapsulated tags</span>
          </div>
        </div>
        <div class="feature">
          <div class="feature-icon">
            <img src="/icons/graphql.svg">
          </div>
          <div class="feature-description">
            <span class="feature-title">Easily customizable</span>
            <span class="feature-subtitle">Spec-compatible API</span>
          </div>
        </div>
        <div class="feature">
          <div class="feature-icon">
            <img src="/icons/react.svg">
          </div>
          <div class="feature-description">
            <span class="feature-title">Framework-ready</span>
            <span class="feature-subtitle">Interoperable & future-ready</span>
          </div>
        </div>
        <div class="feature">
          <div class="feature-icon">
            <img src="/icons/zap.svg">
          </div>
          <div class="feature-description">
            <span class="feature-title">Batteries-included</span>
            <span class="feature-subtitle">Everything you need</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <figure class="quote">
      <blockquote>
        “This changes everything”
      </blockquote>
      <figcaption>— Patrik Wilhelmsson (CTO, Madington)</figcaption>
    </figure>
    <p class="footer-text">Made by the Team behind <a href="https://madington.com">Madington</a></p>
  </div>
</div>
