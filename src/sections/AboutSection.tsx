import { useRef } from 'react';
import { motion, useInView, type Variants, type Easing } from 'framer-motion';

const smoothEase: Easing = [0.25, 0.46, 0.45, 0.94];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: smoothEase },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as Easing },
  },
};

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-primary)',
        padding: 'clamp(80px, 10vh, 120px) clamp(24px, 5vw, 80px)',
      }}
    >
      {/* Floating watermark */}
      <motion.span
        className="absolute font-display font-bold pointer-events-none select-none hidden lg:block"
        style={{
          fontSize: 'clamp(200px, 30vw, 400px)',
          color: 'rgba(245, 240, 235, 0.03)',
          right: '-5%',
          top: '10%',
          zIndex: 0,
        }}
        animate={
          isInView
            ? {
                y: [0, -10, 0],
                transition: {
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut' as Easing,
                },
              }
            : {}
        }
      >
        VA
      </motion.span>

      <div className="max-content relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Left column - Text */}
          <motion.div
            className="lg:w-[45%]"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <motion.span
              className="font-mono-label font-bold text-7xl uppercase tracking-[0.08em] block mb-4"
              style={{ color: 'var(--accent)' }}
              variants={slideInLeft}
                >
                About Me
              </motion.span>

            <motion.p
              className="text-xl leading-[1.65] mb-4"
              style={{ color: 'var(--text-secondary)' }}
              variants={fadeInUp}
            >
              Hi, I'm Kiem — a dedicated General Virtual Assistant based in Davao City,
              Philippines. With hands-on experience across email management, customer
              service, content creation, and administrative support, I help busy
              entrepreneurs and business owners reclaim their time.
            </motion.p>

            <motion.p
              className="text-xl leading-[1.65] mb-6"
              style={{ color: 'var(--text-secondary)' }}
              variants={fadeInUp}
            >
              My approach is simple: I treat your business like it's my own. Every email
              answered, every calendar synced, every piece of content crafted — it's all
              done with precision, care, and a genuine commitment to your success.
            </motion.p>

            <motion.p
              className="text-xl leading-[1.65] mb-8"
              style={{ color: 'var(--text-secondary)' }}
              variants={fadeInUp}
            >
              When you work with me, you're not just hiring help — you're gaining a
              reliable partner who's invested in keeping your operations smooth and your
              mind at ease.
            </motion.p>


          </motion.div>

          {/* Right column - Image */}
          <motion.div
            className="lg:w-[55%] relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: smoothEase, delay: 0.2 }}
          >
            <div
              className="relative overflow-hidden rounded-xl"
              style={{
                border: '1px solid var(--border-subtle)',
              }}
            >
              <img
                src="/assets/about-portrait.jpg"
                alt="Kiem - Virtual Assistant at work"
                className="w-full h-auto object-cover"
                style={{ aspectRatio: '3/4' }}
              />
              {/* Gradient overlay at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1/3"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0, 13, 26, 0.6) 0%, transparent 100%)',
                }}
              />
            </div>

            {/* Floating badge */}
            <motion.div
              className="absolute -bottom-4 -left-4 px-5 py-3 rounded-lg hidden md:block"
              style={{
                backgroundColor: 'var(--accent)',
                boxShadow: '0 8px 32px rgba(230, 57, 70, 0.3)',
              }}
              animate={
                isInView
                  ? {
                      y: [0, -8, 0],
                      transition: {
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut' as Easing,
                        delay: 0.5,
                      },
                    }
                  : {}
              }
            >
              <span className="font-mono-label text-base uppercase tracking-wider text-white">
               Kiem E. Delos Santos
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
