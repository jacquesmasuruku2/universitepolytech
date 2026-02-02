
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Mail, Phone, Moon, Sun, ShieldAlert, ChevronDown, ExternalLink, UserCircle } from 'lucide-react';
import { NAV_ITEMS, UNIVERSITY_ABBR, CONTACT_EMAIL, CONTACT_PHONE, LOGO_URL } from '../constants';

interface NavbarProps {
  onOpenAdmin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check initial theme
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }

    // Close portal menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (portalRef.current && !portalRef.current.contains(event.target as Node)) {
        setPortalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <div className="fixed w-full z-50">
      {/* Top Bar - Contact Info */}
      <div className={`bg-upgBlue dark:bg-slate-950 text-white py-2 px-4 border-b border-white/10 hidden md:block transition-all duration-300 ${scrolled ? 'h-0 opacity-0 overflow-hidden py-0' : 'h-auto opacity-100'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px] font-semibold tracking-wider uppercase">
          <div className="flex gap-6">
            <span className="flex items-center gap-2">
              <Mail size={12} className="text-upgGold" /> {CONTACT_EMAIL}
            </span>
            <span className="flex items-center gap-2">
              <Phone size={12} className="text-upgGold" /> {CONTACT_PHONE}
            </span>
          </div>
          <div className="flex gap-4">
            <span className="text-upgGold">Université Polytechnique de Goma</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`transition-all duration-300 ${scrolled ? 'bg-upgBlue dark:bg-slate-900 shadow-lg py-2' : 'bg-white/95 dark:bg-slate-900 md:bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="UPG Logo" className={`transition-all duration-300 ${scrolled ? 'h-10' : 'h-12 md:h-16'}`} />
              <span className={`text-2xl font-bold tracking-tighter ${scrolled ? 'text-white' : 'text-upgBlue dark:text-white'}`}>
                {UNIVERSITY_ABBR}
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-bold uppercase tracking-widest transition-colors hover:text-upgGold ${scrolled ? 'text-white' : 'text-upgBlue dark:text-slate-300 dark:hover:text-upgGold'}`}
                >
                  {item.label}
                </a>
              ))}
              
              <button 
                onClick={toggleTheme} 
                className={`p-2 rounded-full transition-colors ${scrolled ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-upgBlue dark:text-white'}`}
                title="Changer de thème"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="flex items-center gap-2">
                {/* PORTAIL DROPDOWN */}
                <div className="relative" ref={portalRef}>
                  <button
                    onClick={() => setPortalOpen(!portalOpen)}
                    className="bg-upgGold text-upgBlue font-bold px-6 py-2 rounded shadow-md hover:bg-upgLightGold transition-all text-xs tracking-widest flex items-center gap-2 group"
                  >
                    PORTAIL <ChevronDown size={14} className={`transition-transform duration-300 ${portalOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {portalOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-2 space-y-1">
                        <a
                          href="#registration"
                          onClick={() => setPortalOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-upgBlue dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors group"
                        >
                          <div className="bg-upgBlue/10 dark:bg-upgGold/10 p-2 rounded-lg group-hover:bg-upgGold group-hover:text-upgBlue transition-colors">
                            <UserCircle size={18} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">S'inscrire</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">Nouvelles admissions</span>
                          </div>
                        </a>
                        <a
                          href="https://upgoma-digital.vercel.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setPortalOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-upgBlue dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors group"
                        >
                          <div className="bg-upgBlue/10 dark:bg-upgGold/10 p-2 rounded-lg group-hover:bg-upgGold group-hover:text-upgBlue transition-colors">
                            <ExternalLink size={18} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">Infos Académiques</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">Portail Étudiant Digital</span>
                          </div>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={onOpenAdmin}
                  className={`p-2 rounded shadow-md transition-all flex items-center gap-2 text-xs font-bold tracking-widest ${scrolled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-upgBlue text-white hover:bg-upgBlue/90 dark:bg-slate-800'}`}
                  title="Espace Administration"
                >
                  <ShieldAlert size={14} className="text-upgGold" />
                  <span className="hidden lg:inline">ADMIN</span>
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              <button onClick={toggleTheme} className={scrolled ? 'text-white' : 'text-upgBlue dark:text-white'}>
                {isDark ? <Sun size={24} /> : <Moon size={24} />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={scrolled ? 'text-white' : 'text-upgBlue dark:text-white'}
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-upgBlue dark:bg-slate-900 text-white absolute w-full left-0 animate-in fade-in slide-in-from-top-4">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium border-b border-white/10"
                >
                  {item.label}
                </a>
              ))}
              <div className="bg-slate-800/50 p-2 flex flex-col gap-1">
                 <a
                  href="#registration"
                  onClick={() => setIsOpen(false)}
                  className="block bg-upgGold text-upgBlue font-bold px-3 py-4 text-sm tracking-widest rounded-t-lg"
                >
                  S'INSCRIRE MAINTENANT
                </a>
                <a
                  href="https://upgoma-digital.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="block bg-white/10 text-white font-bold px-3 py-4 text-sm tracking-widest rounded-b-lg flex items-center justify-center gap-2"
                >
                  INFOS ACADÉMIQUES <ExternalLink size={16} />
                </a>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAdmin();
                }}
                className="w-full bg-slate-900 text-white font-bold px-3 py-4 text-base flex items-center justify-center gap-2"
              >
                <ShieldAlert size={18} className="text-upgGold" /> ACCÈS ADMIN
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
