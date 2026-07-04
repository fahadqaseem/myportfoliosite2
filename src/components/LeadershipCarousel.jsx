import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './LeadershipCarousel.css';

const leadershipItems = [
  {
    id: 1,
    tag: 'Founder Leadership',
    title: 'Ecombranding.co',
    label: 'Agency Co-Founder',
    period: '2021 - 2024',
    imageClass: 'leadership-visual leadership-visual--one',
    description:
      'Built and led a digital branding and e-commerce agency serving 200+ clients. The work combined creative direction, storefront execution, and client delivery across a cross-functional team.',
    highlights: ['200+ clients', '$200K+ revenue', 'Storefront delivery', 'Creative operations'],
  },
  {
    id: 2,
    tag: 'Operational Leadership',
    title: 'Image2work',
    label: 'Pakistan Operations Lead',
    period: '2023 - 2024',
    imageClass: 'leadership-visual leadership-visual--two',
    description:
      'Scaled a regional AI operations team around secure dataset delivery, annotation workflows, and quality assurance for computer-vision training data. The role centered on process design, reliability, and execution under SLA pressure.',
    highlights: ['Team scaling', 'QA pipelines', 'SFTP delivery', 'SLA ownership'],
  },
  {
    id: 3,
    tag: 'Research Leadership',
    title: 'Wayne State University',
    label: 'Graduate Research Assistant',
    period: '2026 - Present',
    imageClass: 'leadership-visual leadership-visual--three',
    description:
      'Lead AI pipeline work for deep-mapping research involving historical and geospatial archives. The emphasis is on structured extraction, rigorous evaluation, and reproducible model comparison across OCR and multimodal systems.',
    highlights: ['OCR evaluation', 'Structured extraction', 'Research pipelines', 'Regression testing'],
  },
  {
    id: 4,
    tag: 'Technical Leadership',
    title: 'Truck It In',
    label: 'CRM / Systems Lead',
    period: '2021 - 2022',
    imageClass: 'leadership-visual leadership-visual--four',
    description:
      'Implemented CRM systems during a rapid growth phase and supported operations with reporting, process documentation, and team onboarding. It was hands-on systems leadership focused on adoption and clarity.',
    highlights: ['CRM rollout', 'Dashboards', 'Team training', 'Operational enablement'],
  },
  {
    id: 5,
    tag: 'Engineering Leadership',
    title: 'Team Hammerhead',
    label: 'President',
    period: '2018 - 2020',
    imageClass: 'leadership-visual leadership-visual--five',
    description:
      'Led a multidisciplinary student team building an energy-efficient electric vehicle for Shell Eco-marathon Asia. The role blended technical coordination, embedded-systems collaboration, and team momentum.',
    highlights: ['Team leadership', 'Vehicle design', 'Embedded systems', 'Global 6th place'],
  },
  {
    id: 6,
    tag: 'Professional Development',
    title: 'Apple Developer Academy',
    label: 'Foundation Program',
    period: '2026',
    imageClass: 'leadership-visual leadership-visual--six',
    description:
      'Completed a hands-on app-development program covering user research, product design, UX workflows, and Swift-based iOS foundations. The experience sharpened product thinking alongside engineering execution.',
    highlights: ['User research', 'Product design', 'Swift foundations', 'App prototyping'],
  },
  {
    id: 7,
    tag: 'Industry Learning',
    title: 'SEMI University',
    label: 'Semiconductor Certifications',
    period: '2026',
    imageClass: 'leadership-visual leadership-visual--seven',
    description:
      'Completed semiconductor technology and manufacturing seminars covering IC design, wafer processing, transistor technologies, and the business side of semiconductor production.',
    highlights: ['Semiconductor tech', 'Manufacturing', 'Business context', 'Systems perspective'],
  },
  {
    id: 8,
    tag: 'Community',
    title: 'Alternative Spring Break Detroit',
    label: 'Community Volunteer',
    period: '2026',
    imageClass: 'leadership-visual leadership-visual--eight',
    description:
      'Participated in a Detroit community engagement and service-learning program focused on teamwork, cultural awareness, and local impact. It added a people-centered dimension to leadership beyond purely technical work.',
    highlights: ['Community service', 'Teamwork', 'Leadership development', 'Local engagement'],
  },
];

export default function LeadershipCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const barRef = useRef(null);
  const tabRefs = useRef([]);
  const scrollRafRef = useRef(null);

  const maxIndex = leadershipItems.length - 1;

  const clampIndex = useCallback(
    (index) => Math.max(0, Math.min(maxIndex, index)),
    [maxIndex]
  );

  const activeItem = leadershipItems[activeIndex];

  const syncTabIntoView = useCallback((index) => {
    const tab = tabRefs.current[index];
    if (!tab) return;

    tab.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, []);

  const goTo = useCallback(
    (index) => {
      const nextIndex = clampIndex(index);
      setActiveIndex(nextIndex);
      syncTabIntoView(nextIndex);
    },
    [clampIndex, syncTabIntoView]
  );

  const onBarScroll = useCallback(() => {
    if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    scrollRafRef.current = requestAnimationFrame(() => {
      const bar = barRef.current;
      if (!bar) return;

      const barCenter = bar.scrollLeft + bar.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      tabRefs.current.forEach((tab, index) => {
        if (!tab) return;
        const tabCenter = tab.offsetLeft + tab.clientWidth / 2;
        const distance = Math.abs(tabCenter - barCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex((current) => (current === closestIndex ? current : closestIndex));
    });
  }, []);

  useEffect(() => {
    syncTabIntoView(0);
    return () => {
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, [syncTabIntoView]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowLeft') goTo(activeIndex - 1);
      if (event.key === 'ArrowRight') goTo(activeIndex + 1);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, goTo]);

  return (
    <section id="leadership" className="leadership-section" aria-label="Leadership Activities">
      <div className="leadership-wrap">
        <div className="leadership-header">
          <p className="leadership-kicker">Leadership Activities</p>
        </div>

        <motion.div
          className="leadership-media-shell"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              className={activeItem.imageClass}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="leadership-visual-card">
                <div className="leadership-visual-topline">
                  <span>{activeItem.tag}</span>
                  <span>{activeItem.period}</span>
                </div>
                <div className="leadership-visual-title">{activeItem.title}</div>
                <div className="leadership-visual-label">{activeItem.label}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="leadership-bar-shell" aria-label="Leadership tabs and navigation">
          <button
            type="button"
            className="leadership-arrow"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous leadership item"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="leadership-bar" ref={barRef} onScroll={onBarScroll} role="tablist" aria-label="Leadership options">
            {leadershipItems.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={item.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`leadership-tab ${isActive ? 'is-active' : ''}`}
                  onClick={() => goTo(index)}
                >
                  <span className="leadership-tab-label">{item.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="leadership-arrow"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === maxIndex}
            aria-label="Next leadership item"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            className="leadership-copy-box"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="leadership-copy-meta">
              <div>
                <div className="leadership-copy-kicker">{activeItem.tag}</div>
                <div className="leadership-copy-subtitle">{activeItem.period}</div>
              </div>
              <div className="leadership-copy-subtitle">Demo leadership data</div>
            </div>

            <h3 className="leadership-copy-title">{activeItem.title}</h3>
            <p className="leadership-copy-description">{activeItem.description}</p>

            <div className="leadership-copy-highlights" aria-label="Leadership highlights">
              {activeItem.highlights.map((highlight) => (
                <span key={highlight} className="leadership-highlight-pill">
                  {highlight}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
