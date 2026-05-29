import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, X } from 'lucide-react';

const contactDetails = [
  {
    icon: Mail,
    label: 'Email',
    value: 'delossantoskiem0906@gmail.com',
    href: 'mailto:delossantoskiem0906@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+63 955 200 1030',
    href: 'tel:+639552001030',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Davao City, Davao Del Sur, Philippines',
    href: null,
  },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: 'service_0ywg3mh',
          template_id: 'template_or5ahv4',
          user_id: 'lsjbJmZo6oUAT9uj2',
          template_params: {
            to_email: 'delossantoskiem0906@gmail.com',
            name: formData.name,
            email: formData.email,
            service_type: formData.service,
            message: formData.message,
          },
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', service: '', message: '' });
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitStatus('idle');
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: 'clamp(80px, 10vh, 120px) clamp(24px, 5vw, 80px)',
      }}
    >
      <div className="max-content">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left column - Text */}
          <motion.div
            className="lg:w-[55%]"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span
              className="font-mono-label text-5xl uppercase tracking-[0.08em] block mb-4"
              style={{ color: 'var(--accent)' }}
            >
              Let&apos;s Connect
            </span>
            <h2
              className="font-display font-bold leading-[1.1] mb-4"
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                color: 'var(--text-dark)',
              }}
            >
              Ready to Free Up Your Time?
            </h2>
            <p
              className="text-base leading-[1.65] mb-8"
              style={{ color: 'rgba(26, 26, 26, 0.7)' }}
            >
              Whether you need ongoing support or help with a specific project,
              I&apos;d love to hear from you. Let&apos;s discuss how I can help
              streamline your business and give you the freedom to focus on what
              you do best.
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center font-medium text-sm text-white rounded-full transition-all duration-300 hover:scale-[1.03]"
              style={{
                backgroundColor: 'var(--accent)',
                padding: '14px 32px',
                width: 'fit-content',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Send a Message
            </button>

            {/* Contact details */}
            <div className="flex flex-col gap-4 mt-10">
              {contactDetails.map((detail, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(230, 57, 70, 0.1)' }}
                  >
                    <detail.icon size={18} style={{ color: 'var(--accent)' }} />
                  </div>
                  {detail.href ? (
                    <a
                      href={detail.href}
                      className="text-sm transition-colors duration-300 hover:text-[var(--accent)]"
                      style={{ color: 'rgba(26, 26, 26, 0.7)' }}
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <span
                      className="text-sm"
                      style={{ color: 'rgba(26, 26, 26, 0.7)' }}
                    >
                      {detail.value}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right column - QR Code */}
          <motion.div
            className="lg:w-[45%] flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div
              className="p-5 rounded-xl"
              style={{
                backgroundColor: 'white',
                border: '2px solid var(--border-light)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
              }}
            >
              <img
                src="/assets/qr-code.png"
                alt="QR Code for Linktree - Scan to connect"
                className="w-[220px] h-[220px] md:w-[260px] md:h-[260px] object-contain"
              />
            </div>
            <p
              className="text-sm mt-4 text-center"
              style={{ color: 'rgba(26, 26, 26, 0.5)' }}
            >
              Scan to connect on Linktree
            </p>
            <a
              href="https://linktr.ee/velixavabykiem"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm mt-1 font-medium transition-colors duration-300 hover:text-[var(--accent-hover)]"
              style={{ color: 'var(--accent)' }}
            >
              linktr.ee/velixavabykiem
            </a>

            {/* Calendly Section */}
            <div className="mt-8 flex flex-col items-center">
              <a
                href="https://calendly.com/delossantoskiem0906/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-[1.05]"
                style={{
                  backgroundColor: 'rgba(230, 57, 70, 0.1)',
                  border: '1px solid var(--border-light)',
                }}
              >
                <img
                  src="/logos/calendly-logo.png"
                  alt="Calendly"
                  className="w-20 h-20 object-contain"
                />
                <span
                  className="text-base font-medium"
                  style={{ color: 'var(--accent)' }}
                >
                  Schedule a Meeting
                </span>
              </a>
              <p
                className="text-sm mt-3"
                style={{ color: 'rgba(26, 26, 26, 0.5)' }}
              >
                Book a 30-min call with me
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-md rounded-xl overflow-hidden"
              style={{ backgroundColor: 'var(--bg-primary)' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'rgba(230, 57, 70, 0.1)' }}
              >
                <X size={20} style={{ color: 'var(--accent)' }} />
              </button>

              {/* Form content */}
              <div className="p-8">
<p
                  className="text-base mb-6"
                  style={{ color: 'var(--text-white)' }}
                >
                  Tell me about your project and I&apos;ll get back to you within 24 hours.
                </p>

                {submitStatus === 'success' ? (
                  <motion.div
                    className="text-center py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div
                      className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                      style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
                    >
                      <span style={{ color: '#22c55e', fontSize: '24px' }}>✓</span>
                    </div>
                    <p
                      className="font-semibold"
                      style={{ color: 'var(--text-dark)' }}
                    >
                      Message sent successfully!
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: 'rgba(26, 26, 26, 0.6)' }}
                    >
                      I&apos;ll be in touch soon.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        className="block text-xs uppercase tracking-wider mb-2"
                        style={{ color: 'var(--accent)' }}
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded-lg text-sm transition-colors"
                        style={{
                          backgroundColor: 'white',
                          border: '1px solid var(--border-light)',
                          color: 'var(--text-dark)',
                        }}
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs uppercase tracking-wider mb-2"
                        style={{ color: 'var(--accent)' }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded-lg text-sm transition-colors"
                        style={{
                          backgroundColor: 'white',
                          border: '1px solid var(--border-light)',
                          color: 'var(--text-dark)',
                        }}
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs uppercase tracking-wider mb-2"
                        style={{ color: 'var(--accent)' }}
                      >
                        Service Type
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg text-sm transition-colors"
                        style={{
                          backgroundColor: 'white',
                          border: '1px solid var(--border-light)',
                          color: 'var(--text-dark)',
                        }}
                      >
                        <option value="">Select a service...</option>
                        <option value="Daily Feed & Content Scheduling">Daily Feed & Content Scheduling</option>
                        <option value="Basic Video Editing">Basic Video Editing</option>
                        <option value="Graphic Design">Graphic Design</option>
                        <option value="Calendar Scheduling">Calendar Scheduling</option>
                        <option value="Email Management">Email Management</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className="block text-xs uppercase tracking-wider mb-2"
                        style={{ color: 'var(--accent)' }}
                      >
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg text-sm transition-colors resize-none"
                        style={{
                          backgroundColor: 'white',
                          border: '1px solid var(--border-light)',
                          color: 'var(--text-dark)',
                        }}
                        placeholder="Tell me about your project..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2 rounded-full font-medium text-sm text-white transition-all duration-300 disabled:opacity-50"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      {isLoading ? 'Sending...' : 'Send Message'}
                    </button>

                    {submitStatus === 'error' && (
                      <p
                        className="text-sm text-center"
                        style={{ color: '#ef4444' }}
                      >
                        Error sending message. Please try again.
                      </p>
                    )}
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
