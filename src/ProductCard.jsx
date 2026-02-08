import React from 'react';
import styled from 'styled-components';

const ProductCard = ({ title, description }) => {
  return (
    <StyledWrapper>
      <div className="card">
        <p className="card-title">{title}</p>
        <p className="small-desc">
          {description}
        </p>
        <div className="go-corner">
          <div className="go-arrow">→</div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card-title {
    color: #ffffff;
    font-size: 1.5em;
    line-height: normal;
    font-weight: 700;
    margin-bottom: 0.5em;
  }

  .small-desc {
    font-size: 1em;
    font-weight: 400;
    line-height: 1.5em;
    color: #cccccc;
  }

  .go-corner {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 2em;
    height: 2em;
    overflow: hidden;
    top: 0;
    right: 0;
    background: linear-gradient(135deg, #3A0CA3, #3709b7ff);
    border-radius: 0 4px 0 32px;
  }

  .go-arrow {
    margin-top: -4px;
    margin-right: -4px;
    color: white;
    font-family: courier, sans;
  }

  .card {
    display: block;
    position: relative;
    max-width: 300px;
    max-height: 320px;
    background-color: #1a1a1a;
    border-radius: 10px;
    padding: 2em 1.2em;
    margin: 12px;
    text-decoration: none;
    z-index: 0;
    overflow: hidden;
    background: linear-gradient(to bottom, #1a1a1a, #0a0a0a);
    font-family: 'Inter', sans-serif;
    border: 1px solid #333;
  }

  .card:before {
    content: '';
    position: absolute;
    z-index: -1;
    top: -16px;
    right: -16px;
    background: linear-gradient(135deg, #3A0CA3, #392883ff);
    height: 32px;
    width: 32px;
    border-radius: 32px;
    transform: scale(1);
    transform-origin: 50% 50%;
    transition: transform 0.35s ease-out;
  }

  .card:hover:before {
    transform: scale(28);
  }

  .card:hover .small-desc {
    transition: all 0.5s ease-out;
    color: rgba(255, 255, 255, 0.8);
  }

  .card:hover .card-title {
    transition: all 0.5s ease-out;
    color: #ffffff;
  }`;

export default ProductCard;
