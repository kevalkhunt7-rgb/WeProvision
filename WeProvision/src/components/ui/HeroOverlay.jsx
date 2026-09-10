export default function HeroOverlay() {
  return (
    <div className="hero-overlay">
      <div className="hero-content">

        <p className="hero-eyebrow">
          DIGITAL EXPERIENCE STUDIO
        </p>

        <h1>
          WE BUILD
          <br />
          <span>DIGITAL WORLDS</span>
        </h1>

        <p className="hero-description">
          Game Development · Web Development ·
          UI/UX · VR · 3D
        </p>

        <button className="hero-button">
          EXPLORE
          <span>↓</span>
        </button>

      </div>

      <div className="scroll-indicator">
        <span>SCROLL TO EXPLORE</span>

        <div className="scroll-line" />
      </div>
    </div>
  );
}