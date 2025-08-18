import React from 'react';
import styled from 'styled-components';

// 1. Component now accepts an icon, title, description, and iconColor
const FeatureCard = ({ icon, title, description, iconColor }) => {
  // The icon prop is a component, so we can render it directly
  const Icon = icon;
  return (
    // We pass the iconColor to the styled-component for dynamic styling
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
    background: #252547; /* Matched original card background */
    border-radius: 1rem; /* Matched original card border-radius */
    border: none;
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
    /* This makes the content pop out on hover */
    transition: transform .5s;
  }
  
  .card:hover .card_icon,
  .card:hover .card_title,
  .card:hover .card_description {
    transform: translateZ(50px);
  }

  .card_icon {
    margin-bottom: 1rem;
    /* Use the passed-in color prop for the icon */
    color: ${props => props.iconColor || '#FFF'};
  }

  .card_title {
    color: #fff;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .card_description {
    color: #a0aec0; /* A light gray for the description */
    font-size: 0.875rem;
  }
`;

export default FeatureCard;