import React from 'react';
import styled from 'styled-components';

const Switch = ({ isManual, onToggle }) => {
    return (
        <StyledWrapper>
            <label htmlFor="filter" className="switch" aria-label="Toggle Filter">
                <input
                    type="checkbox"
                    id="filter"
                    checked={!isManual} // Checked = AI (left), Unchecked = Manual (right) based on request layout? 
                    // Actually, let's look at the CSS: 
                    // "MANUAL" is first span, "AI" is second.
                    // When checked: slider moves to right (AI). 
                    // When unchecked: slider is left (MANUAL).
                    // Wait, usually:
                    // Input checked -> Switch ON -> Right side
                    // Input unchecked -> Switch OFF -> Left side
                    // Let's assume Checked = AI, Unchecked = Manual.
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
    --_switch-bg-clr: rgba(255, 255, 255, 0.1);
    --_switch-padding: 4px; /* padding around button*/
    --_slider-bg-clr: rgba(60, 32, 216, 0.4); /* slider color unchecked */
    --_slider-bg-clr-on: #3c20d8; /* slider color checked */
    --_slider-txt-clr: #ffffff;
    --_label-padding: 1rem 2rem; /* padding around the labels -  this gives the switch it's global width and height */
    --_switch-easing: cubic-bezier(
      0.47,
      1.64,
      0.41,
      0.8
    ); /* easing on toggle switch */
    color: white;
    width: fit-content;
    display: flex;
    justify-content: center;
    position: relative;
    border-radius: 9999px;
    cursor: pointer;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    position: relative;
    isolation: isolate;
  }

  .switch input[type="checkbox"] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  .switch > span {
    display: grid;
    place-content: center;
    transition: opacity 300ms ease-in-out 150ms;
    padding: var(--_label-padding);
    z-index: 2; /* UPDATED: ensure text is above slider */
  }
  .switch::before,
  .switch::after {
    content: "";
    position: absolute;
    border-radius: inherit;
    transition: inset 150ms ease-in-out;
  }
  /* switch slider */
  .switch::before {
    background-color: var(--_slider-bg-clr);
    inset: var(--_switch-padding) 50% var(--_switch-padding)
      var(--_switch-padding);
    transition:
      inset 500ms var(--_switch-easing),
      background-color 500ms ease-in-out;
    z-index: 0; /* UPDATED: slider behind text */
    box-shadow:
      inset 0 1px 1px rgba(0, 0, 0, 0.3),
      0 1px rgba(255, 255, 255, 0.3);
  }
  /* switch bg color */
  .switch::after {
    background-color: var(--_switch-bg-clr);
    inset: 0;
    z-index: -1; /* UPDATED: background behind slider */
  }
  /* switch hover & focus */
  .switch:focus-within::after {
    inset: -0.25rem;
  }
  .switch:has(input:checked):hover > span:first-of-type,
  .switch:has(input:not(:checked)):hover > span:last-of-type {
    opacity: 1;
    transition-delay: 0ms;
    transition-duration: 100ms;
  }
  /* switch hover */
  .switch:has(input:checked):hover::before {
    inset: var(--_switch-padding) var(--_switch-padding) var(--_switch-padding)
      45%;
  }
  .switch:has(input:not(:checked)):hover::before {
    inset: var(--_switch-padding) 45% var(--_switch-padding)
      var(--_switch-padding);
  }
  /* checked - move slider to right */
  .switch:has(input:checked)::before {
    background-color: var(--_slider-bg-clr-on);
    inset: var(--_switch-padding) var(--_switch-padding) var(--_switch-padding)
      50%;
  }
  /* checked - set opacity */
  .switch > span:last-of-type,
  .switch > input:checked + span:first-of-type {
    opacity: 0.75;
  }
  .switch > input:checked ~ span:last-of-type {
    opacity: 1;
  }`;

export default Switch;
