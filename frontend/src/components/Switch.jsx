import React from 'react';
import styled from 'styled-components';

const Switch = ({ isManual, onToggle }) => {
  return (
    <StyledWrapper>
      <label htmlFor="filter" className="switch" aria-label="Toggle Mode">
        <input
          type="checkbox"
          id="filter"
          checked={!isManual}
          onChange={(e) => onToggle(!e.target.checked)}
        />
        <span>MANUAL</span>
        <span>AI</span>
      </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .switch {
    --_switch-bg-clr: rgba(255, 255, 255, 0.08);
    --_switch-padding: 3px;
    --_slider-bg-clr: rgba(60, 32, 216, 0.35);
    --_slider-bg-clr-on: #0891b2;
    --_label-padding: 0.45rem 1.2rem;
    --_switch-easing: cubic-bezier(0.47, 1.64, 0.41, 0.8);
    color: rgba(255,255,255,0.85);
    width: fit-content;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    position: relative;
    isolation: isolate;
    border-radius: 9999px;
    cursor: pointer;
  }

  .switch input[type="checkbox"] {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .switch > span {
    display: grid;
    place-content: center;
    transition: opacity 250ms ease-in-out 100ms;
    padding: var(--_label-padding);
    z-index: 2;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.06em;
  }

  /* background track */
  .switch::after {
    content: "";
    position: absolute;
    border-radius: inherit;
    inset: 0;
    background-color: var(--_switch-bg-clr);
    z-index: -1;
  }

  /* sliding pill */
  .switch::before {
    content: "";
    position: absolute;
    border-radius: inherit;
    background-color: var(--_slider-bg-clr);
    inset: var(--_switch-padding) 50% var(--_switch-padding) var(--_switch-padding);
    transition: inset 400ms var(--_switch-easing), background-color 400ms ease-in-out;
    z-index: 0;
    box-shadow: inset 0 1px 1px rgba(0,0,0,0.25), 0 1px rgba(255,255,255,0.15);
  }

  /* checked → slide pill right + colour */
  .switch:has(input:checked)::before {
    background-color: var(--_slider-bg-clr-on);
    inset: var(--_switch-padding) var(--_switch-padding) var(--_switch-padding) 50%;
  }

  /* active label gets full opacity */
  .switch > span:last-of-type,
  .switch > input:checked + span:first-of-type {
    opacity: 0.55;
  }
  .switch > input:checked ~ span:last-of-type {
    opacity: 1;
  }

  /* hover nudge */
  .switch:has(input:checked):hover::before {
    inset: var(--_switch-padding) var(--_switch-padding) var(--_switch-padding) 46%;
  }
  .switch:has(input:not(:checked)):hover::before {
    inset: var(--_switch-padding) 46% var(--_switch-padding) var(--_switch-padding);
  }
`;

export default Switch;
