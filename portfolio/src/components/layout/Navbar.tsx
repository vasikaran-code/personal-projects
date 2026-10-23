import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navLinks, personalInfo } from '../../data/portfolio';

const NAV_OFFSET = 96;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('');
  const [underline, setUnderline] = useState({ left: 0, width: 0 });
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // Track which section is currently under the navbar
  useEffect(() => {
    const ids = navLinks.map((link) => link.href.slice(1));

    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) {
        setActive(ids[ids.length - 1]);
        return;
      }

      let current = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= NAV_OFFSET) current = id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Slide the underline under the active link
  useLayoutEffect(() => {
    const update = () => {
      const el = linkRefs.current[active];
      setUnderline(el ? { left: el.offsetLeft, width: el.offsetWidth } : { left: 0, width: 0 });
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [active]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <a
            href="#"
            className="font-heading font-bold text-xl text-gray-900 hover:text-primary-600 transition-colors"
          >
            {personalInfo.name.split(' ')[0]}
            <span className="text-primary-600">.</span>
          </a>

          <div className="relative hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const id = link.href.slice(1);
              const isActive = active === id;
              return (
                <a
                  key={link.name}
                  ref={(el) => {
                    linkRefs.current[id] = el;
                  }}
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors duration-300 ${
                    isActive
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[14px] h-0.5 rounded-full bg-primary-600 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                left: underline.left + 12,
                width: Math.max(underline.width - 24, 0),
                opacity: underline.width ? 1 : 0,
              }}
            />
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = active === link.href.slice(1);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    aria-current={isActive ? 'true' : undefined}
                    className={`px-3 py-2 rounded-md border-l-2 font-medium transition-colors duration-300 ${
                      isActive
                        ? 'text-primary-600 border-primary-600'
                        : 'text-gray-600 border-transparent hover:text-primary-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
