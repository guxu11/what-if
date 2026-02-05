import { useState, useEffect } from 'react';

export function TitleScreen({ onStart }) {
  const [showButton, setShowButton] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Create sparkle particles
    const newParticles = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 2
      });
    }
    setParticles(newParticles);

    // Show button after animation
    setTimeout(() => setShowButton(true), 1500);
  }, []);

  return (
    <div className="title-screen">
      <div className="title-background">
        {particles.map(p => (
          <div
            key={p.id}
            className="sparkle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </div>

      <div className="title-content">
        <h1 className="title-text">
          <span className="title-glow">What</span>
          <span className="title-pulse">-</span>
          <span className="title-glow">If</span>
          <span className="title-glow"> Game</span>
        </h1>
        <p className="title-subtitle">
          Explore alternate paths. Discover yourself. Live in the present.
        </p>

        {showButton && (
          <button className="start-button" onClick={onStart}>
            <span className="btn-text">Begin Your Journey</span>
            <span className="btn-arrow">→</span>
          </button>
        )}
      </div>

      <div className="scroll-indicator">
        <span className="scroll-icon">▼</span>
      </div>
    </div>
  );
}
