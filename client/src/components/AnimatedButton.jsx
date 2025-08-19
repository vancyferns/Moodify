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
  @keyframes border-animation {
    to {
      transform: translateX(-25%);
    }
  }

  .codepen-button {
    display: block;
    cursor: pointer;
    color: white;
    margin: 0 auto;
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
    /* UPDATED: New gradient to match the site's theme */
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
    display: block;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    background: #0f0f1a;
    border-radius: 3px;
    height: 100%;
  }
`;

export default AnimatedButton;