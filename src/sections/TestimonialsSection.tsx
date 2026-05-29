import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--bg-primary)',
        padding: 'clamp(80px, 10vh, 120px) clamp(24px, 5vw, 80px)',
      }}
    >
      <div className="max-content">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="font-mono-label font-bold leading-[1.1] uppercase tracking-[0.08em]"
            style={{
              fontSize: 'clamp(2rem, 3vw, 2.75rem)',
              color: 'var(--accent)',
              letterSpacing: '0.12em',
            }}
          >
            Certified Virtual Assistant
          </h2>
        </motion.div>

        <div className="flex justify-center max-w-3xl mx-auto">
          <motion.div
            className="w-full rounded-xl overflow-hidden"
            style={{
              border: '1px solid var(--border-light)',
              backgroundColor: 'white',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <img
              src="/assets/certificate/certificate.png"
              alt="Certified Virtual Assistant Certificate"
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
