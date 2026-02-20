import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const Radio = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActive = () => {
    if (location.pathname === '/saved') return 'saved';
    if (location.pathname === '/settings') return 'settings';
    return 'home';
  };

  const active = getActive();

  return (
    <StyledWrapper>
      <div className="radio-group">
        <div className="slider" />
        <div className="radio-option">
          <input
            type="radio" name="option" id="option1"
            checked={active === 'home'}
            onChange={() => navigate('/')}
            readOnly
          />
          <label htmlFor="option1" className="radio-label" onClick={() => navigate('/')}>Home</label>
        </div>
        <div className="radio-option">
          <input
            type="radio" name="option" id="option2"
            checked={active === 'saved'}
            onChange={() => navigate('/saved')}
            readOnly
          />
          <label htmlFor="option2" className="radio-label" onClick={() => navigate('/saved')}>Saved</label>
        </div>
        <div className="radio-option">
          <input
            type="radio" name="option" id="option3"
            checked={active === 'settings'}
            onChange={() => navigate('/settings')}
            readOnly
          />
          <label htmlFor="option3" className="radio-label">Settings</label>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .radio-group {
    display: flex;
    gap: 0;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    padding: 4px;
    border-radius: 25px;
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 0, 0, 0.3);
    position: relative;
    animation: slide-in 0.6s ease-out;
    width: 280px;
    height: 40px;
  }

  @keyframes slide-in {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Indicador deslizante de fondo */
  .slider {
    position: absolute;
    top: 4px;
    bottom: 4px;
    background: #0a0a0a;
    border-radius: 25px;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    box-shadow:
      0 3px 12px rgba(0, 0, 0, 0.15),
      0 1px 4px rgba(0, 0, 0, 0.1);
    z-index: 0;
  }

  .radio-option {
    position: relative;
    z-index: 1;
    flex: 1;
  }

  .radio-option input[type="radio"] {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  .radio-label {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 16px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    user-select: none;
    border-radius: 25px;
    position: relative;
    white-space: nowrap;
  }

  .radio-option input[type="radio"]:checked + .radio-label {
    color: #00c2d4;
    text-shadow: none;
  }

  .radio-label:hover {
    color: rgba(255, 255, 255, 0.9);
  }

  /* Efecto de brillo al pasar el mouse */
  .radio-label::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50px;
    background: rgba(255, 255, 255, 0.1);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .radio-label:hover::before {
    opacity: 1;
  }

  /* Animación de entrada escalonada */
  .radio-option {
    animation: fade-in 0.5s ease-out backwards;
  }

  .radio-option:nth-child(1) {
    animation-delay: 0.1s;
  }
  .radio-option:nth-child(2) {
    animation-delay: 0.2s;
  }
  .radio-option:nth-child(3) {
    animation-delay: 0.3s;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Ajuste automático del slider */
  .radio-group:has(#option1:checked) .slider {
    left: 4px;
    width: calc(33.333% - 2.67px);
  }

  .radio-group:has(#option2:checked) .slider {
    left: calc(33.333% + 1.33px);
    width: calc(33.333% - 2.67px);
  }

  .radio-group:has(#option3:checked) .slider {
    left: calc(66.666% - 1.33px);
    width: calc(33.333% - 2.67px);
  }

  /* Efecto de pulso en el slider */
  @keyframes pulse {
    0% {
      box-shadow:
        0 3px 12px rgba(0, 0, 0, 0.15),
        0 1px 4px rgba(0, 0, 0, 0.1);
    }
    50% {
      box-shadow:
        0 5px 20px rgba(102, 126, 234, 0.3),
        0 2px 8px rgba(0, 0, 0, 0.15);
    }
    100% {
      box-shadow:
        0 3px 12px rgba(0, 0, 0, 0.15),
        0 1px 4px rgba(0, 0, 0, 0.1);
    }
  }

  .radio-option input[type="radio"]:checked ~ .slider {
    animation: pulse 0.6s ease-out;
  }

  /* Brillo decorativo en el contenedor */
  .radio-group::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    border-radius: 50px;
    z-index: -1;
    animation: shine 3s linear infinite;
    opacity: 0;
  }

  @keyframes shine {
    0% {
      transform: translateX(-100%) rotate(45deg);
    }
    100% {
      transform: translateX(100%) rotate(45deg);
    }
  }`;

export default Radio;
