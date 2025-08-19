import React from 'react';
import styled from 'styled-components';

const FeatureCard = ({ icon, title, description, iconColor }) => {
  const Icon = icon;
  return (
    <StyledWrapper iconColor={iconColor}>
      <figure className="card">
        <div className="card_icon">
          <Icon size={48} />
        </div>
        <h3 className="card_title">{title}</h3>
        <p className="card_description">{description}</p>
      </figure>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    height: 250px;
    border-radius: 1rem;
    
    /* --- Glassmorphism Styles Added --- */
    background: rgba(255, 255, 255, 0.05); /* Semi-transparent background */
    backdrop-filter: blur(12px);          /* Frosted glass effect */
    border: 1px solid rgba(255, 255, 255, 0.1); /* Subtle white border */
    /* --- End of Glassmorphism Styles --- */

    position: relative;
    transform-style: preserve-3d;
    will-change: transform;
    transition: transform .5s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    text-align: center;
  }

  .card:hover {
    transform: translateZ(20px) rotateX(15deg) rotateY(15deg);
  }
  
  .card_icon, .card_title, .card_description {
    transition: transform .5s;
  }
  
  .card:hover .card_icon,
  .card:hover .card_title,
  .card:hover .card_description {
    transform: translateZ(50px);
  }

  .card_icon {
    margin-bottom: 1rem;
    color: ${props => props.iconColor || '#FFF'};
  }

  .card_title {
    color: #fff;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .card_description {
    color: #a0aec0;
    font-size: 0.875rem;
  }
`;

export default FeatureCard;