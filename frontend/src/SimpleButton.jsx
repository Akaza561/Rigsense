import React from 'react';
import styled from 'styled-components';

const SimpleButton = ({ username }) => {
  return (
    <StyledButton>
      Hello
      <span className="subtitle"> ─ {username || 'AKAZA'}</span>
    </StyledButton>
  );
}

const StyledButton = styled.button`
  display: inline-flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem; /* rounded-xl */
  border: 1.58px solid #52525b; /* border-[1.58px] border-zinc-600 */
  background-color: #09090b; /* bg-zinc-950 */
  padding: 0.75rem 1.25rem; /* px-5 py-3 */
  font-weight: 500; /* font-medium */
  color: #e2e8f0; /* text-slate-200 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1); /* transition-all duration-300 */
  font-family: 'Inter', sans-serif; /* ensuring consistency */
  font-size: 1rem;

  &:hover {
    transform: translateY(-0.335rem); /* hover:[transform:translateY(-.335rem)] */
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* hover:shadow-xl */
  }

  .subtitle {
    color: rgba(203, 213, 225, 0.85); /* text-slate-300/85 */
    margin-left: 0.4rem; /* spacing for readability */
  }
`;

export default SimpleButton;
