import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <button className="btn-17">
        <span className="text-container">
          <span className="text">RIG UP!
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{ width: '1.2em', height: '1.2em', display: 'inline-block', verticalAlign: 'middle', marginLeft: '12px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .btn-17,
  .btn-17 *,
  .btn-17 :after,
  .btn-17 :before,
  .btn-17:after,
  .btn-17:before {
    border: 0 solid;
    box-sizing: border-box;
  }

  .btn-17 {
    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: button;
    background-color: #000;
    background-image: none;
    color: #dfdcdcff;
    cursor: pointer;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
      Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
    font-size: 1rem;
    font-weight: 900;
    line-height: 1.5;
    margin: 0;
    -webkit-mask-image: -webkit-radial-gradient(#000, #e2e2e2ff);
    padding: 0;
    text-transform: uppercase;
  }

  .btn-17:disabled {
    cursor: default;
  }

  .btn-17:-moz-focusring {
    outline: auto;
  }

  .btn-17 svg {
    display: block;
    vertical-align: middle;
  }

  .btn-17 [hidden] {
    display: none;
  }

  .btn-17 {
    border-radius: 99rem;
    border-width: 2px;
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 20px rgba(58, 12, 163, 0.5);
    padding: 0.8rem 1.6rem;
    z-index: 0;
  }

  .btn-17,
  .btn-17 .text-container {
    overflow: hidden;
    position: relative;
  }

  .btn-17 .text-container {
    display: block;
    mix-blend-mode: difference;
  }

  .btn-17 .text {
    display: block;
    position: relative;
  }

  .btn-17:hover .text {
    -webkit-animation: move-up-alternate 0.3s forwards;
    animation: move-up-alternate 0.3s forwards;
  }

  @-webkit-keyframes move-up-alternate {
    0% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(80%);
    }

    51% {
      transform: translateY(-80%);
    }

    to {
      transform: translateY(0);
    }
  }

  @keyframes move-up-alternate {
    0% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(80%);
    }

    51% {
      transform: translateY(-80%);
    }

    to {
      transform: translateY(0);
    }
  }

  .btn-17:after,
  .btn-17:before {
    --skew: 0.2;
    background: #e2dcdcff;
    content: "";
    display: block;
    height: 102%;
    left: calc(-50% - 50% * var(--skew));
    pointer-events: none;
    position: absolute;
    top: -104%;
    transform: skew(calc(150deg * var(--skew))) translateY(var(--progress, 0));
    transition: transform 0.2s ease;
    width: 100%;
  }

  .btn-17:after {
    --progress: 0%;
    left: calc(50% + 50% * var(--skew));
    top: 102%;
    z-index: -1;
  }

  .btn-17:hover:before {
    --progress: 100%;
  }

  .btn-17:hover:after {
    --progress: -102%;
  }`;

export default Button;
