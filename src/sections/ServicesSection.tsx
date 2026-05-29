import { useRef, useState } from 'react';
import { motion, useInView, type Variants, type Easing } from 'framer-motion';
import {
  Calendar,
  Package,
  Share2,
  Folder,
  Target,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const serviceImages = [
  '/assets/portfolio-1.jpg',
  '/assets/portfolio-2.jpg',
  '/assets/portfolio-3.jpg',
  '/assets/portfolio-4.jpg',
  '/assets/portfolio-5.jpg',
];

const services = [
  {
    icon: Calendar,
    title: 'Daily Feed & Content Scheduling',
    description:
      'Managing and automating consistency across all platforms using modern scheduling tools to ensure your content reaches your audience at peak hours.',
    image: serviceImages[0],
  },
  {
    icon: Package,
    title: ' Basic Video Editing',
    description:
      'Producing clean, engaging short-form video assets and aesthetic graphics tailored to your brand\'s visual identity.',
    image: serviceImages[1],
  },
  {
    icon: Share2,
    title: 'Graphic Design',
    description:
      'Handling daily audience interactions, filtering direct messages, and fostering a community around your brand.',
    image: serviceImages[2],
  },
  {
    icon: Folder,
    title: 'Calendar Scheduling',
    description:
      'Maintaining a well-structured digital asset pipeline so raw footage, templates, and final media are always securely stored and accessible.',
    image: serviceImages[3],
  },
  {
    icon: Target,
    title: 'Email Management',
    description:
      'Monitoring emerging platform trends, trending audio, and targeted keyword data to optimize content visibility.',
    image: serviceImages[4],
  },
];

const smoothEase: Easing = [0.25, 0.46, 0.45, 0.94];

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: smoothEase },
  },
};

const slideInBottom: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: smoothEase },
  },
};

function Lightbox({
  image,
  title,
  onClose,
  onNext,
  onPrev,
}: {
  image: string;
  title: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-4xl max-h-[90vh] w-full mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-50"
          aria-label="Close lightbox"
        >
          <X size={32} />
        </button>

        <div className="relative bg-black rounded-xl overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-auto object-contain max-h-[80vh]"
          />
        </div>

        <div className="mt-4 text-center">
          <p className="text-white text-lg font-semibold">{title}</p>
        </div>

        <button
          onClick={onPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 text-white hover:bg-white hover:bg-opacity-10 rounded-full p-2 transition-all"
          aria-label="Previous image"
        >
          <ChevronLeft size={32} />
        </button>

        <button
          onClick={onNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 text-white hover:bg-white hover:bg-opacity-10 rounded-full p-2 transition-all"
          aria-label="Next image"
        >
          <ChevronRight size={32} />
        </button>
      </motion.div>
    </motion.div>
  );
}

function ImageMarquee({
  images,
  direction = 'left',
  onImageClick,
}: {
  images: string[];
  direction?: 'left' | 'right';
  onImageClick: (index: number) => void;
}) {
  const duplicated = [...images, ...images, ...images, ...images];

  return (
    <div className="relative overflow-hidden w-full py-4">
      <motion.div
        className="flex gap-4"
        animate={{
          x: direction === 'left' ? ['0%', '-75%'] : ['0%', '75%'],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear' as Easing,
        }}
      >
        {duplicated.map((img, i) => (
          <motion.div
            key={i}
            className="flex-shrink-0 w-[280px] h-[160px] rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            style={{ border: '1px solid var(--border-light)' }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onImageClick(i % images.length)}
          >
            <img
              src={img}
              alt={`Service work ${(i % images.length) + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function FloatingImages({
  images,
  onImageClick,
}: {
  images: string[];
  onImageClick: (index: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: '-50px' });

  return (
    <div ref={containerRef} className="relative h-[200px] overflow-hidden rounded-xl my-8">
      {images.map((img, i) => (
        <motion.div
          key={i}
          className="absolute w-[200px] h-[140px] rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          style={{
            border: '1px solid var(--border-light)',
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 2) * 20}%`,
          }}
          initial={{ opacity: 0, scale: 0.8, x: -50 }}
          animate={
            isInView
              ? {
                  opacity: [0, 1, 1, 0],
                  scale: [0.8, 1, 1, 0.9],
                  x: [-50, 0, 0, 50],
                }
              : {}
          }
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 1,
            delay: i * 0.8,
            ease: 'easeInOut' as Easing,
          }}
          whileHover={{ scale: 1.05 }}
          onClick={() => onImageClick(i)}
        >
          <img
            src={img}
            alt={`Work sample ${i + 1}`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index % services.length);
    setLightboxOpen(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % services.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  return (
    <>
      <section
        id="services"
        ref={sectionRef}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: 'clamp(80px, 10vh, 120px) clamp(24px, 5vw, 80px)',
        }}
      >
        <div className="max-content">
          <ImageMarquee
            images={serviceImages}
            direction="left"
            onImageClick={handleImageClick}
          />

          <div className="flex flex-col lg:flex-row gap-12 mt-12">
            <motion.div
              className="lg:w-[40%] lg:sticky lg:top-[120px] lg:self-start"
              variants={slideInLeft}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <span
                className="font-mono-label text-5xl uppercase tracking-[0.08em] block mb-4"
                style={{ color: 'var(--accent)' }}
              >
                What I Do
              </span>
              <h2
                className="font-display font-bold leading-[1.1] mb-4"
                style={{
                  fontSize: 'clamp(2rem, 3vw, 2.75rem)',
                  color: 'var(--text-dark)',
                }}
              >
                Services That Keep You Moving
              </h2>
              <p
                className="text-base leading-[1.65]"
                style={{ color: 'rgba(26, 26, 26, 0.7)' }}
              >
                From inbox zero to content that connects — I handle the details so
                you don't have to.
              </p>

              <div className="hidden lg:block mt-8">
                <FloatingImages
                  images={serviceImages.slice(0, 4)}
                  onImageClick={handleImageClick}
                />
              </div>
            </motion.div>

            <div className="lg:w-[60%] flex flex-col gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  className="group rounded-xl p-8 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid var(--border-light)',
                  }}
                  variants={slideInBottom}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  transition={{ delay: index * 0.12 }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      '0 12px 40px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(230, 57, 70, 0.1)' }}
                    >
                      <service.icon
                        size={24}
                        style={{ color: 'var(--accent)' }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="font-display font-semibold text-lg mb-2"
                        style={{ color: 'var(--text-dark)' }}
                      >
                        {service.title}
                      </h3>
                      <p
                        className="text-[15px] leading-[1.6]"
                        style={{ color: 'rgba(26, 26, 26, 0.7)' }}
                      >
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <motion.div
                    className="mt-4 rounded-lg overflow-hidden h-[120px] cursor-pointer group/image"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleImageClick(index)}
                  >
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110"
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {lightboxOpen && (
        <Lightbox
          image={services[currentImageIndex].image}
          title={services[currentImageIndex].title}
          onClose={() => setLightboxOpen(false)}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
        />
      )}
    </>
  );
}
