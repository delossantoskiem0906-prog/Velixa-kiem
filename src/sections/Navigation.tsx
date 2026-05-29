import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#about');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);

      // Track which section is in view
      for (const link of navLinks) {
        const section = document.querySelector(link.href);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(link.href);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    setActiveSection(href);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[rgba(0,13,26,0.85)] backdrop-blur-[12px]'
          : 'bg-transparent'
      }`}
      style={{ height: '72px' }}
    >
        <div className="flex items-center justify-center h-full max-w-7xl mx-auto px-6 md:px-10">
        {/* Logo - Left */}
        <a
          href="#"
          className="flex items-center flex-shrink-0 mr-8"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img
            src="/assets/logo-icon.png"
            alt="Velixa Logo"
            className="h-20 w-auto"
            style={{ marginRight: '-20px' }}
          />
          <span className="font-mono-label text-sm font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-primary)' }}>
            VELIXA
          </span>
        </a>

        {/* Desktop Nav - Right */}
        <div className="hidden md:flex items-center gap-10 ml-auto">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-medium text-lg tracking-wide transition-colors duration-300"
              style={{ 
                color: activeSection === link.href ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                if (activeSection !== link.href) {
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== link.href) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X size={24} color="var(--text-primary)" />
          ) : (
            <Menu size={24} color="var(--text-primary)" />
          )}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden fixed top-[72px] right-0 w-64 h-screen transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: 'rgba(0, 13, 26, 0.95)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex flex-col p-6 gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-medium text-lg tracking-wide transition-colors duration-300"
              style={{ 
                color: activeSection === link.href ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                if (activeSection !== link.href) {
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== link.href) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
