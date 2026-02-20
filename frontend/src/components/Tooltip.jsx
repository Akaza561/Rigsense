import React from 'react';
import styled from 'styled-components';

const Tooltip = ({ text }) => {
    if (!text) return null;
    return (
        <StyledWrapper>
            <div className="tooltip">
                <div className="icon">i</div>
                <div className="tooltiptext">{text}</div>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  display: inline-flex;
  align-items: center;

  .tooltip {
    position: relative;
    display: inline-block;
    cursor: pointer;
    font-family: "Inter", sans-serif;
  }

  .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }

  .tooltiptext {
    visibility: hidden;
    width: 220px;
    background-color: rgba(20, 20, 20, 0.95);
    backdrop-filter: blur(8px);
    color: #ccc;
    text-align: left;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    padding: 10px 12px;
    position: absolute;
    z-index: 10;
    bottom: 130%;
    left: 50%;
    margin-left: -110px;
    opacity: 0;
    transition: opacity 0.25s;
    font-size: 0.75rem;
    line-height: 1.5;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }

  .tooltiptext::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    margin-left: -8px;
    border-width: 8px;
    border-style: solid;
    border-color: rgba(20, 20, 20, 0.95) transparent transparent transparent;
  }

  .tooltip .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    background: rgba(0, 194, 212, 0.2);
    color: #00c2d4;
    border: 1px solid rgba(0, 194, 212, 0.3);
    border-radius: 50%;
    font-size: 0.65rem;
    font-weight: 700;
    font-style: italic;
    transition: all 0.2s;
  }

  .tooltip:hover .icon {
    background: rgba(0, 194, 212, 0.35);
    border-color: #00c2d4;
  }`;

export default Tooltip;
