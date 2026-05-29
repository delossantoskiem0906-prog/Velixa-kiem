import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import type { Variants, Easing } from 'framer-motion';
import { Play, X, ExternalLink } from 'lucide-react';

// Portfolio items - easily replaceable
// To change: update the image and video paths below
const portfolioItems = [
  {
    id: 1,
    category: 'Social Media',
    title: 'Fitness Brand Instagram Campaign',
    description: 'Complete social media management including 30+ graphics, stories, and engagement strategy.',
    image: '/assets/portfolio/portfolio-1.jpg',
    video: null,
  },
  {
    id: 2,
    category: 'Email Marketing',
    title: 'Email Campaign Performance',
    description: 'Designed and managed email sequences achieving 45% open rates and 12% click-through.',
    image: '/assets/portfolio/portfolio-2.jpg',
    video: null,
  },
  {
    id: 3,
    category: 'Content Planning',
    title: '3-Month Content Calendar',
    description: 'Strategic content calendar with color-coded categories across all major platforms.',
    image: '/assets/portfolio/portfolio-3.jpg',
    video: null,
  },
  {
    id: 4,
    category: 'Customer Support',
    title: 'Support Metrics Dashboard',
    description: 'Maintained 98% customer satisfaction with under 2-hour response time consistently.',
    image: '/assets/portfolio/portfolio-4.jpg',
    video: null,
  },
  {
    id: 5,
    category: 'Content Writing',
    title: 'Blog Article Series',
    description: 'Productivity and business growth article series with engaging editorial design.',
    image: '/assets/portfolio/portfolio-5.jpg',
    video: null,
  },
  {
    id: 6,
    category: 'Branding',
    title: 'Brand Style Guide',
    description: 'Complete brand identity system including logo rules, color palette, and typography.',
    image: '/assets/portfolio/portfolio-6.jpg',
    video: null,
  },
  {
    id: 7,
    category: 'Video Content',
    title: 'Social Media Reel',
    description: 'Engaging meme-style video content created for brand awareness campaigns.',
    image: '/assets/portfolio/quotes-content.png',
    video: '/assets/portfolio/portfolio-video.mp4',
  },
  {
    id: 8,
    category: 'Administration',
    title: 'Skills & Expertise',
    description: 'Comprehensive skill set covering email management, invoicing, data entry, and more.',
    image: '/assets/portfolio/portfolio-7.jpg',
    video: null,
  },
  {
    id: 9,
    category: 'Administration',
    title: 'Skills & Expertise',
    description: 'Comprehensive skill set covering email management, invoicing, data entry, and more.',
    image: '/assets/portfolio/portfolio-8.jpg',
    video: null,
  },
  {
    id: 10,
    category: 'Administration',
    title: 'Skills & Expertise',
    description: 'Comprehensive skill set covering email management, invoicing, data entry, and more.',
    image: '/assets/portfolio/portfolio-9.jpg',
    video: null,
  },
  {
    id: 11,
    category: 'Administration',
    title: 'Skills & Expertise',
    description: 'Comprehensive skill set covering email management, invoicing, data entry, and more.',
    image: '/assets/portfolio/portfolio-10.jpg',
    video: null,
  },
  {
    id: 12,
    category: 'Administration',
    title: 'Skills & Expertise',
    description: 'Comprehensive skill set covering email management, invoicing, data entry, and more.',
    image: '/assets/portfolio/portfolio-11.jpg',
    video: null,
  },
];

const smoothEase: Easing = [0.25, 0.46, 0.45, 0.94];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: smoothEase },
  },
};

export default function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section
      id="work"
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: 'clamp(80px, 10vh, 120px) clamp(24px, 5vw, 80px)',
      }}
    >
      <div className="max-content">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: smoothEase }}
        >
          <span
            className="font-mono-label text-6xl uppercase tracking-[0.08em] block mb-4"
            style={{ color: 'var(--accent)' }}
          >
            My Works
          </span>
          <h2
            className="font-display font-bold leading-[1.1]"
            style={{
              fontSize: 'clamp(2rem, 3vw, 2.75rem)',
              color: 'var(--text-dark)',
            }}
          >
            Results That Speak
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {portfolioItems.map((item) => (
            <motion.div
              key={item.id}
              className="group rounded-xl overflow-hidden cursor-pointer"
              style={{
                backgroundColor: 'white',
                border: '1px solid var(--border-light)',
              }}
              variants={cardVariants}
              whileHover={{
                y: -4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Image/Video thumbnail */}
              <div
                className="relative aspect-[16/10] overflow-hidden"
                onClick={() => {
                  if (!item.video) {
                    setSelectedImage(item.image);
                  }
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Play button for video items */}
                {item.video && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => item.video && setSelectedVideo(item.video)}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      <Play size={24} fill="white" color="white" />
                    </div>
                  </div>
                )}

                {/* External link icon */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                  >
                    <ExternalLink size={14} color="#1A1A1A" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative w-full max-w-4xl rounded-xl overflow-hidden"
              style={{ backgroundColor: 'var(--bg-primary)' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                onClick={() => setSelectedImage(null)}
              >
                <X size={20} color="white" />
              </button>
              <img
                src={selectedImage}
                alt="Full screen view"
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              className="relative w-full max-w-3xl rounded-xl overflow-hidden"
              style={{ backgroundColor: 'var(--bg-primary)' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                onClick={() => setSelectedVideo(null)}
              >
                <X size={20} color="white" />
              </button>
              <video
                src={selectedVideo}
                controls
                autoPlay
                className="w-full aspect-[4/5] object-contain"
                style={{ backgroundColor: 'black' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
