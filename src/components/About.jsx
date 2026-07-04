import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import KnightScene from '../KnightScene.jsx';
import './About.css';

const words = [
  "I", "build", "full-stack", "AI", "systems", "that", "turn", "complex", "research",
  "into", "usable", "software.", "From", "OCR", "evaluation", "pipelines", "to",
  "computer", "vision", "and", "generative", "models,", "I", "focus", "on", "measurable,",
  "reliable,", "human-centered", "results."
];

export default function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 50%"]
  });

  return (
    <section id="about" ref={containerRef} className="about-section">
      <div className="about-content">
        <p className="about-text">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + (1 / words.length);

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const y = useTransform(scrollYProgress, [start, end], [10, 0]);

            return (
              <motion.span key={i} style={{ opacity, y, display: 'inline-block', marginRight: '0.25em' }}>
                {word}
              </motion.span>
            );
          })}
        </p>

        <div className="about-knight" aria-hidden="true">
          <KnightScene />
        </div>
      </div>
    </section>
  );
}
