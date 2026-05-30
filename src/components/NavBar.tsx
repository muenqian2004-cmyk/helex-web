import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { Send, Sun, MessageCircle } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { SubmitDialog } from './SubmitDialog';
import { ThemeDialog } from './ThemeDialog';
import { ContactDialog } from './ContactDialog';

const navLinks = [
  { to: '/', label: '首页' },
];

export function NavBar() {
  const location = useLocation();
  const [showSubmit, setShowSubmit] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Logo className="h-6 w-6 shrink-0" />
            <span>Aerilia海克斯大乱斗工具</span>
          </Link>

          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={buttonVariants({
                  variant: location.pathname === link.to ? 'secondary' : 'ghost',
                  size: 'sm',
                })}
              >
                {link.label}
              </Link>
            ))}
            <button onClick={() => setShowSubmit(true)} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
              <Send className="h-4 w-4 mr-1" /> 投稿
            </button>
            <button onClick={() => setShowTheme(true)} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
              <Sun className="h-4 w-4 mr-1" /> 颜色
            </button>
            <Link to="/builds" className={buttonVariants({ variant: location.pathname === '/builds' ? 'secondary' : 'ghost', size: 'sm' })}>
              强化出装
            </Link>
            <button onClick={() => setShowContact(true)} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
              <MessageCircle className="h-4 w-4 mr-1" /> 联系我们
            </button>
          </div>
        </nav>
      </header>

      {showSubmit && <SubmitDialog onClose={() => setShowSubmit(false)} />}
      {showTheme && <ThemeDialog onClose={() => setShowTheme(false)} />}
      {showContact && <ContactDialog onClose={() => setShowContact(false)} />}
    </>
  );
}
