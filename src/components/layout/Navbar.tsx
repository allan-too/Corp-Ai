
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    ...(user ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
  ];

  const toolsLinks = [
    { to: '/tools/crm', label: 'CRM' },
    { to: '/tools/sales-forecast', label: 'Sales Forecast' },
    { to: '/tools/chat-support', label: 'Chat Support' },
    { to: '/tools/marketing', label: 'Marketing' },
    { to: '/tools/social-media', label: 'Social Media' },
    { to: '/tools/analytics', label: 'Analytics' },
    { to: '/tools/hr', label: 'HR Management' },
    { to: '/tools/contracts', label: 'Contract Review' },
    { to: '/tools/finance', label: 'Finance Planner' },
    { to: '/tools/supply-chain', label: 'Supply Chain' },
    { to: '/tools/scheduler', label: 'Scheduler' },
    { to: '/tools/reviews', label: 'Reviews' },
    { to: '/tools/accounting', label: 'Accounting' },
    { to: '/tools/inventory', label: 'Inventory' },
    { to: '/tools/legal-crm', label: 'Legal CRM' },
    { to: '/tools/notifications', label: 'Notifications' },
    { to: '/tools/reservation', label: 'Reservation' },
    { to: '/tools/telco', label: 'Telco Analytics' },
    { to: '/tools/student-assist', label: 'Student Assistant' },
  ];

  return (
    <nav className="glass-card border-b border-white/20 dark:border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                CORP AI
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-foreground/80 hover:text-neon-blue px-3 py-2 text-sm font-medium transition-all duration-300 hover:glow-pulse"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Tools Dropdown */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-1 hover:text-neon-blue transition-colors">
                      <span>Tools</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto glass-card">
                    {toolsLinks.map((tool) => (
                      <DropdownMenuItem key={tool.to} asChild>
                        <Link to={tool.to} className="w-full hover:text-neon-blue transition-colors">
                          {tool.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-r from-neon-blue to-neon-purple text-white">
                        {user.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-card" align="end" forceMount>
                  <DropdownMenuItem className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-blue transition-all duration-300">
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 glass-card mt-2 rounded-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-foreground/80 hover:text-neon-blue block px-3 py-2 text-base font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Tools Menu */}
              {user && (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                    Tools
                  </div>
                  {toolsLinks.map((tool) => (
                    <Link
                      key={tool.to}
                      to={tool.to}
                      className="text-foreground/80 hover:text-neon-blue block px-3 py-2 text-base font-medium pl-6 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {tool.label}
                    </Link>
                  ))}
                </>
              )}
              
              {user ? (
                <div className="border-t border-white/20 pt-4 mt-4">
                  <div className="px-3 py-2 text-sm text-foreground/60">{user.email}</div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="border-t border-white/20 pt-4 mt-4 space-y-2">
                  <Button variant="ghost" className="w-full" asChild>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-neon-blue to-neon-purple" asChild>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
