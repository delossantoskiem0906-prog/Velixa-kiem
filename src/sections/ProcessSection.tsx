import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const toolsList = [
  {
    name: 'Notion',
    image: '/assets/logos/notion.png',
  },
  {
    name: 'Trello',
    image: '/assets/logos/trello.png',
  },
  {
    name: 'CapCut',
    image: '/assets/logos/capcut.png',
  },
  {
    name: 'Canva',
    image: '/assets/logos/canva.png',
  },
  {
    name: 'ChatGPT',
    image: '/assets/logos/chatgpt.png',
  },
  {
    name: 'Meta',
    image: '/assets/logos/meta.png',
  },
  {
    name: 'Google Workspace',
    image: '/assets/logos/google-workspace.png',
  },
  {
    name: 'Calendly',
    image: '/assets/logos/calendly.png',
  },
  {
    name: 'Buffer',
    image: '/assets/logos/buffer.png',
  },
  {
    name: 'Google Gemini',
    image: '/assets/logos/google-gemini.png',
  },
  {
    name: 'Zoom',
    image: '/assets/logos/zoom.png',
  },
  {
    name: 'Claude',
    image: '/assets/logos/claude.png',
  },
  {
    name: 'Kimi AI',
    image: '/assets/logos/kimi-ai.png',
  },
] as const;

type Tool = typeof toolsList[number];

function ToolCard({ tool, index, isInView }: { tool: Tool; index: number; isInView: boolean }) {
  return (
    <motion.div
      className="flex-shrink-0 w-48 h-48 flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-300 cursor-pointer hover:-translate-y-2"
      style={{
        backgroundColor: 'white',
        border: '1px solid var(--border-light)',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.05 * index,
      }}
      whileHover={{ boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
    >
      <div className="mb-6 flex items-center justify-center h-24 w-24 transition-transform duration-300 group-hover:scale-110">
        <img
          src={tool.image}
          alt={tool.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <p
        className="text-base font-semibold text-center leading-tight"
        style={{ color: 'black' }}

      >
        {tool.name}
      </p>
    </motion.div>
  );
}

export default function ProcessSection() {
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
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="font-mono-label font-bold text-6xl uppercase tracking-[0.08em] block mb-4"
            style={{ color: 'var(--accent)' }}
          >
            Tools I Use
          </span>

        </motion.div>

        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-8 overflow-x-auto pb-6"
            style={{ scrollBehavior: 'smooth' }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {toolsList.map((tool, index) => (
              <ToolCard
                key={tool.name}
                tool={tool}
                index={index}
                isInView={isInView}
              />
            ))}
          </motion.div>
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p
            className="text-lg font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            ← Scroll to see all tools →
          </p>
        </motion.div>
      </div>
    </section>
  );
}
