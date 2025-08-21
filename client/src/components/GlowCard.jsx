import React from 'react';
import styled from 'styled-components';

const GlowCard = ({ stepNumber, title, description }) => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="step-number">
          {stepNumber}
        </div>
        <p className="heading">
          {title}
        </p>
        <p className="description">
          {description}
        </p>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    position: relative;
    width: 280px;
    height: 320px;
    background-color: #000;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 24px;
    gap: 16px;
    border-radius: 12px;
    cursor: pointer;
    color: white;
  }

  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    left: -5px;
    margin: auto;
    width: 290px;
    height: 330px;
    border-radius: 14px;
    background: linear-gradient(-45deg, #e81cff 0%, #40c9ff 100%);
    z-index: -10;
    pointer-events: none;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .card::after {
    content: "";
    z-index: -1;
    position: absolute;
    inset: 0;
    background: linear-gradient(-45deg, #fc00ff 0%, #00dbde 100%);
    transform: translate3d(0, 0, 0) scale(0.95);
    filter: blur(20px);
  }

  .step-number {
    position: absolute;
    top: 24px;
    right: 24px;
    font-size: 48px;
    font-weight: 800;
    color: #e81cff;
    opacity: 0.3;
  }

  .heading {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 12px;
    color: white;
    line-height: 1.3;
  }

  .description {
    font-size: 15px;
    line-height: 1.8;
    color: #cccccc;
    margin: 0;
  }

  .card:hover::after {
    filter: blur(30px);
  }

  .card:hover::before {
    transform: rotate(-90deg) scaleX(0.5) scaleY(0.77);
  }

  .card:hover .step-number {
    opacity: 0.6;
    transform: scale(1.1);
    transition: all 0.3s ease;
  }

  @media (max-width: 768px) {
    .card {
      width: 100%;
      max-width: 320px;
      height: 280px;
      padding: 20px;
      gap: 14px;
    }

    .card::before {
      width: calc(100% + 10px);
      height: 290px;
    }

    .step-number {
      font-size: 36px;
      top: 20px;
      right: 20px;
    }

    .heading {
      font-size: 20px;
    }

    .description {
      font-size: 14px;
    }
  }
`;

export default GlowCard;