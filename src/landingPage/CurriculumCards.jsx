import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CURRICULUM_CARDS } from './curriculumData';
import './styles/CurriculumCards.css';

export default function CurriculumCards() {
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const navigate = useNavigate();

  return (
    <section className="curriculum-section">
      <div className="curriculum-wrapper">
        
        <div className="curriculum-header">
          <span className="curriculum-eyebrow">[ THE SYLLABUS ]</span>
          <h2 className="curriculum-heading">
            A curriculum built for <span className="italic-muted">intuition.</span>
          </h2>
          <p className="curriculum-desc">
            Explore foundational concepts through interactive visual environments designed to make complex ideas immediately clear.
          </p>
        </div>


        <div className="accordion-container" onMouseLeave={() => setHoveredIndex(0)}>
          {CURRICULUM_CARDS.map((card, idx) => {
            const isHovered = hoveredIndex === idx;
            const gradientClass = card.type === 'arch' ? 'gradient-arch' : 'gradient-os';

            return (
              <div
                key={card.id}
                onMouseEnter={() => setHoveredIndex(idx)}
                onClick={() => {
                  if (card.link) navigate(card.link);
                }}
                className={`accordion-card ${gradientClass} ${isHovered ? 'expanded' : ''}`}
              >
                <div className="card-skewed-bottom" />

                <div className="card-title-wrapper">
                  <span className="card-title-text">
                    {card.title}
                  </span>
                </div>

                <div className="card-phase-badge-wrapper">
                  <span className="card-phase-badge">
                    Phase {card.type === 'arch' ? '01' : '02'}
                  </span>
                </div>
                
                <div className="card-collapsed-text-wrapper">
                  <span className="card-collapsed-text">
                    PHASE {card.type === 'arch' ? '1' : '2'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}