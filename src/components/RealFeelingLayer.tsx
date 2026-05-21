const particles = Array.from({ length: 10 }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  top: `${(index * 53) % 100}%`,
  delay: `${-(index % 8) * 0.7}s`,
  duration: `${10 + (index % 7) * 1.6}s`,
}));

export function RealFeelingLayer() {
  return (
    <div className="real-feeling-layer" aria-hidden="true">
      <div className="ambient-ribbons" />
      <div className="travel-particles">
        {particles.map((particle, index) => (
          <span
            key={index}
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
}
