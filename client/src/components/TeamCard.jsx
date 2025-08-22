import React from 'react';
import styled from 'styled-components';
import { Instagram, Linkedin, Github } from 'lucide-react'; // Example icons

// Helper to render the correct social icon
const SocialIcon = ({ type }) => {
  if (type === 'instagram') return <Instagram size={15} />;
  if (type === 'linkedin') return <Linkedin size={15} />;
  if (type === 'github') return <Github size={15} />;
  return null;
};

const TeamCard = ({ name, role, desc, socials, gradient }) => {
  return (
    <StyledWrapper gradient={gradient}>
      <div className="parent">
        <div className="card">
          <div className="logo">
            <span className="circle circle1" />
            <span className="circle circle2" />
            <span className="circle circle3" />
            <span className="circle circle4" />
            <span className="circle circle5"></span>
          </div>
          <div className="glass" />
          <div className="content">
            <span className="title">{name}</span>
            <span className="text"><strong>{role}</strong><br/>{desc}</span>
          </div>
          <div className="bottom">
            <div className="social-buttons-container">
              {socials.map((social, index) => (
                <a key={index} href={social.href} target="_blank" rel="noopener noreferrer">
                  <button className="social-button">
                    <SocialIcon type={social.type} />
                  </button>
                </a>
              ))}
            </div>
            <div className="view-more">
              <button className="view-more-button">View Profile</button>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

// The styles are adapted to use props for dynamic colors
const StyledWrapper = styled.div`
  .parent {
    /* Reduced size */
    width: 240px;
    height: 300px;
    perspective: 1000px;
  }
  .card {
    height: 100%;
    border-radius: 1.5rem; /* Slightly smaller radius */
    background: ${props => props.gradient || 'linear-gradient(135deg, #8A2BE2 0%, #FF1493 100%)'};
    transition: all 0.5s ease-in-out;
    transform-style: preserve-3d;
    box-shadow: rgba(0,0,0,0.2) 0px 20px 30px -10px;
  }
  .glass {
    transform-style: preserve-3d;
    position: absolute;
    inset: 6px; /* Adjusted inset */
    border-radius: 1.25rem; /* Adjusted radius */
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.35) 100%);
    backdrop-filter: blur(5px);
    transform: translate3d(0px, 0px, 25px);
    border-left: 1px solid white;
    border-bottom: 1px solid white;
    transition: all 0.5s ease-in-out;
  }
  .content {
    /* Adjusted padding */
    padding: 50px 20px 0px 20px;
    transform: translate3d(0, 0, 26px);
    text-align: center;
  }
  .content .title {
    display: block;
    color: #050301;       // Darker text for better contrast
    font-weight: 900;
    font-size: 18px; /* Slightly smaller font */
    text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }
  .content .text {
    display: block;
    color: black;
    font-size: 13px; /* Slightly smaller font */
    margin-top: 8px; /* Adjusted margin */
  }
  .bottom {
    padding: 8px 10px; /* Adjusted padding */
    transform-style: preserve-3d;
    position: absolute;
    bottom: 15px; /* Adjusted position */
    left: 15px;   /* Adjusted position */
    right: 15px;  /* Adjusted position */
    display: flex;
    align-items: center;
    justify-content: space-between;
    transform: translate3d(0, 0, 26px);
  }
  .view-more-button {
    background: none; border: none; color: #fff; font-weight: bold; font-size: 12px;
  }
  .social-buttons-container {
    display: flex; gap: 8px; /* Reduced gap */ transform-style: preserve-3d;
  }
  .social-button {
    width: 30px; aspect-ratio: 1; padding: 5px; background: rgba(255,255,255,0.8);
    border-radius: 50%; border: none; display: grid; place-content: center;
    box-shadow: rgba(0,0,0, 0.3) 0px 7px 5px -5px;
    color: #333;
    transition: all 0.2s ease-in-out;
  }
  .social-button:hover { background: white; color: black; }
  .logo { position: absolute; right: 0; top: 0; transform-style: preserve-3d; }
  .logo .circle {
    display: block; position: absolute; aspect-ratio: 1; border-radius: 50%;
    top: 0; right: 0; box-shadow: rgba(100, 100, 111, 0.2) -10px 10px 20px 0px;
    backdrop-filter: blur(5px);
    background: rgba(255, 255, 255, 0.2);
    transition: all 0.5s ease-in-out;
    display: grid; place-content: center; color: white; font-size: 1.5rem; font-weight: bold;
  }

  /* Resized circles to match the new card size */
  
  
  .parent:hover .card {
    transform: rotate3d(1, 1, 0, 15deg);
    box-shadow: rgba(0,0,0,0.4) 30px 50px 25px -40px;
  }
  .parent:hover .card .bottom .social-button { transform: translate3d(0, 0, 50px); }
  .parent:hover .card .logo .circle { transform: translate3d(0, 0, 100px); }
`;

export default TeamCard;