import React from 'react';
import styled from 'styled-components';

const AnimatedButton = ({ children, onClick }) => {
  return (
    <StyledWrapper onClick={onClick}>
      <button className="codepen-button">
        <span>{children}</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* Added to make it fit well in flex containers */
  display: inline-block; 

  @keyframes border-animation {
    to {
      transform: translateX(-25%);
    }
  }

  .codepen-button {
    display: block;
    cursor: pointer;
    color: white;
    position: relative;
    text-decoration: none;
    font-weight: 600;
    border-radius: 6px;
    overflow: hidden;
    padding: 3px;
    isolation: isolate;
    border: none;
    background: transparent;
  }

  .codepen-button::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 400%;
    height: 100%;
    background: linear-gradient(115deg, #60a5fa, #a855f7, #f472b6, #a855f7, #60a5fa);
    background-size: 25% 100%;
    animation: border-animation .75s linear infinite;
    animation-play-state: paused;
    translate: -5% 0%;
    transition: translate 0.25s ease-out;
  }

  .codepen-button:hover::before {
    animation-play-state: running;
    transition-duration: 0.75s;
    translate: 0% 0%;
  }

  .codepen-button span {
    position: relative;
    display: flex; /* <-- UPDATED */
    align-items: center; /* <-- ADDED for icon alignment */
    justify-content: center; /* <-- ADDED for centering */
    gap: 0.5rem; /* <-- ADDED for spacing between icon and text */
    padding: 0.75rem 1.5rem; /* Adjusted padding slightly for a better fit */
    font-size: 1rem;
    background: #0f0f1a;
    border-radius: 3px;
    height: 100%;
    white-space: nowrap; /* Prevents text from wrapping */
  }
`;

export default AnimatedButton;