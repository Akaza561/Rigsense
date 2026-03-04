import React, { useContext, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from './context/AuthContext';

const Radio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [toast, setToast] = useState(false);

  const getActive = () => {
    if (location.pathname === '/saved') return 'saved';
    if (location.pathname === '/settings') return 'settings';
    return 'home';
  };
  const active = getActive();

  const guard = (path, handler) => {
    if (user) {
      handler();
    } else {
      setToast(true);
      setTimeout(() => setToast(false), 2800);
    }
  };

  return (
    <Wrapper>
      <StyledWrapper>
        <div className="radio-group">
          <div className="slider" />

          {/* Home — always accessible */}
          <div className="radio-option">
            <input type="radio" name="option" id="option1"
              checked={active === 'home'} onChange={() => navigate('/')} readOnly />
            <label htmlFor="option1" className="radio-label" onClick={() => navigate('/')}>Home</label>
          </div>

          {/* Saved — requires login */}
          <div className="radio-option">
            <input type="radio" name="option" id="option2"
              checked={active === 'saved'} onChange={() => guard('/saved', () => navigate('/saved'))} readOnly />
            <label htmlFor="option2" className="radio-label"
              onClick={() => guard('/saved', () => navigate('/saved'))}>
              Saved
            </label>
          </div>

          {/* Settings — requires login */}
          <div className="radio-option">
            <input type="radio" name="option" id="option3"
              checked={active === 'settings'} onChange={() => guard('/settings', () => navigate('/settings'))} readOnly />
            <label htmlFor="option3" className="radio-label"
              onClick={() => guard('/settings', () => navigate('/settings'))}>
              Settings
            </label>
          </div>
        </div>
      </StyledWrapper>

      {/* Toast */}
      {toast && (
        <Toast>
          🔒 Please <a onClick={() => navigate('/login')}>sign in</a> to access this page
        </Toast>
      )}
    </Wrapper>
  );
};

/* ── Styled ──────────────────────────────────────────────── */

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
`;

const Toast = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 17, 26, 0.95);
  border: 1px solid rgba(0, 194, 212, 0.35);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.78rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  white-space: nowrap;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  animation: ${fadeUp} 0.22s ease;
  z-index: 2000;

  a {
    color: #00c2d4;
    font-weight: 700;
    cursor: pointer;
    text-decoration: underline;
    margin: 0 2px;
  }
`;

const StyledWrapper = styled.div`
  .radio-group {
    display: flex;
    gap: 0;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    padding: 4px;
    border-radius: 25px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 0, 0, 0.3);
    position: relative;
    animation: slide-in 0.6s ease-out;
    width: 280px;
    height: 40px;
  }

  @keyframes slide-in {
    from { opacity: 0; transform: scale(0.9); }
    to   { opacity: 1; transform: scale(1); }
  }

  .slider {
    position: absolute;
    top: 4px; bottom: 4px;
    background: #0a0a0a;
    border-radius: 25px;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    box-shadow: 0 3px 12px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.1);
    z-index: 0;
  }

  .radio-option {
    position: relative; z-index: 1; flex: 1;
    animation: fade-in 0.5s ease-out backwards;
  }
  .radio-option:nth-child(2) { animation-delay: 0.1s; }
  .radio-option:nth-child(3) { animation-delay: 0.2s; }
  .radio-option:nth-child(4) { animation-delay: 0.3s; }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .radio-option input[type="radio"] {
    position: absolute; opacity: 0; cursor: pointer;
  }

  .radio-label {
    display: flex; align-items: center; justify-content: center;
    height: 100%; padding: 0 16px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.3s ease;
    user-select: none; border-radius: 25px;
    position: relative; white-space: nowrap;
  }

  .radio-option input[type="radio"]:checked + .radio-label { color: #00c2d4; }

  .radio-label:hover { color: rgba(255, 255, 255, 0.9); }

  .radio-label::before {
    content: ""; position: absolute; inset: 0; border-radius: 50px;
    background: rgba(255,255,255,0.1); opacity: 0; transition: opacity 0.3s ease;
  }
  .radio-label:hover::before { opacity: 1; }

  .radio-group:has(#option1:checked) .slider { left: 4px; width: calc(33.333% - 2.67px); }
  .radio-group:has(#option2:checked) .slider { left: calc(33.333% + 1.33px); width: calc(33.333% - 2.67px); }
  .radio-group:has(#option3:checked) .slider { left: calc(66.666% - 1.33px); width: calc(33.333% - 2.67px); }
`;

export default Radio;
