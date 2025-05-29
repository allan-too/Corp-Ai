
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

const HomePage = () => {
  const { user } = useAuth();
  const [chatMessages, setChatMessages] = useState([
    { type: 'user', message: 'How can AI help streamline my business operations?' },
    { type: 'ai', message: 'CORP AI offers 19+ integrated tools covering CRM, Finance, HR, Marketing, and more. Each tool uses advanced AI to automate tasks and provide insights.' },
    { type: 'user', message: 'What about customer support?' },
    { type: 'ai', message: 'Our Chat Support tool provides 24/7 AI-powered customer assistance, while our Review Management system helps maintain your reputation.' }
  ]);

  const [currentToolIndex, setCurrentToolIndex] = useState(0);

  const tools = [
    { name: 'CRM', icon: '👥', path: '/tools/crm', desc: 'Manage customer relationships with AI insights' },
    { name: 'Sales Forecast', icon: '📈', path: '/tools/sales-forecast', desc: 'Predict sales trends with machine learning' },
    { name: 'Marketing', icon: '📢', path: '/tools/marketing', desc: 'Create targeted campaigns that convert' },
    { name: 'Finance Planner', icon: '💰', path: '/tools/finance', desc: 'Smart budgeting and financial planning' },
    { name: 'HR Management', icon: '👤', path: '/tools/hr', desc: 'Streamline workforce management' },
    { name: 'Analytics', icon: '📊', path: '/tools/analytics', desc: 'Deep business intelligence insights' },
    { name: 'Telco Analytics', icon: '📞', path: '/tools/telco', desc: 'Telecommunications data analysis' },
    { name: 'Student Assistant', icon: '🎓', path: '/tools/student-assist', desc: 'AI-powered educational support' }
  ];

  const industries = [
    { name: 'Retail & E-commerce', image: '🏪', desc: 'Inventory, CRM, Analytics' },
    { name: 'Hospitality', image: '🏨', desc: 'Reservations, Reviews, Support' },
    { name: 'Legal Services', image: '⚖️', desc: 'Contract Review, Legal CRM' },
    { name: 'Telecommunications', image: '📡', desc: 'Network Analytics, Maintenance' },
    { name: 'Education', image: '🎓', desc: 'Student Tools, Scheduling' },
    { name: 'Healthcare', image: '🏥', desc: 'Patient Management, Analytics' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentToolIndex((prev) => (prev + 1) % tools.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [tools.length]);

  // Particle background component
  const ParticleBackground = () => {
    return (
      <div className="particles">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 dark:from-background dark:via-background dark:to-neon-blue/5 relative overflow-hidden">
      <ParticleBackground />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center circuit-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold">
              <span className="block font-sans bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green bg-clip-text text-transparent animate-glow-pulse">
                Unleash AI
              </span>
              <span className="block font-serif text-foreground/90 mt-2">
                Across Your Business
              </span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl md:text-2xl text-foreground/70 font-light">
              From CRM to Finance to Telco & beyond—transform every department with intelligent automation
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Button size="lg" asChild className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-green transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-neon-blue/50">
                  <Link to="/dashboard" className="px-8 py-4 text-lg font-semibold">
                    Go to Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-green transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-neon-blue/50">
                    <Link to="/register" className="px-8 py-4 text-lg font-semibold">
                      Get Started
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="glass-card border-neon-blue/50 hover:border-neon-purple/50 transition-all duration-300 transform hover:scale-105">
                    <Link to="/dashboard" className="px-8 py-4 text-lg font-semibold">
                      View Tools
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Demo Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent mb-4">
              Experience AI-Powered Business Intelligence
            </h2>
            <p className="text-xl text-foreground/70">See how our AI assistant helps solve real business challenges</p>
          </div>
          
          <Card className="glass-card max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-neon-blue">Business AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.type === 'user' 
                        ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white' 
                        : 'glass border border-neon-green/30 text-foreground'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tools Showcase Carousel */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-neon-green to-neon-purple bg-clip-text text-transparent mb-4">
              Comprehensive AI Tools Suite
            </h2>
            <p className="text-xl text-foreground/70">Click any tool to explore its capabilities</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <Link key={tool.path} to={tool.path}>
                <Card className={`glass-card group cursor-pointer transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-neon-blue/30 ${
                  index === currentToolIndex ? 'ring-2 ring-neon-blue shadow-lg shadow-neon-blue/30' : ''
                }`}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4 group-hover:animate-float">{tool.icon}</div>
                    <h3 className="font-semibold text-foreground group-hover:text-neon-blue transition-colors">{tool.name}</h3>
                    <p className="text-sm text-foreground/60 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {tool.desc}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-neon-pink to-neon-cyan bg-clip-text text-transparent mb-4">
              Built for Every Industry
            </h2>
            <p className="text-xl text-foreground/70">Tailored AI solutions across all business sectors</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <Card key={index} className="glass-card group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-neon-cyan/30">
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4 group-hover:animate-float">{industry.image}</div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-neon-cyan transition-colors mb-2">
                    {industry.name}
                  </h3>
                  <p className="text-foreground/60">{industry.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/20 dark:border-white/10 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/dashboard" className="text-foreground/60 hover:text-neon-blue transition-colors">Tools</Link></li>
                <li><Link to="/" className="text-foreground/60 hover:text-neon-blue transition-colors">Features</Link></li>
                <li><Link to="/" className="text-foreground/60 hover:text-neon-blue transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-foreground/60 hover:text-neon-blue transition-colors">About</a></li>
                <li><a href="#" className="text-foreground/60 hover:text-neon-blue transition-colors">Contact</a></li>
                <li><a href="#" className="text-foreground/60 hover:text-neon-blue transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-foreground/60 hover:text-neon-blue transition-colors">Documentation</a></li>
                <li><a href="#" className="text-foreground/60 hover:text-neon-blue transition-colors">GitHub</a></li>
                <li><a href="#" className="text-foreground/60 hover:text-neon-blue transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-foreground/60 hover:text-neon-blue transition-colors">Privacy</a></li>
                <li><a href="#" className="text-foreground/60 hover:text-neon-blue transition-colors">Terms</a></li>
                <li><a href="#" className="text-foreground/60 hover:text-neon-blue transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/20 dark:border-white/10 text-center">
            <p className="text-foreground/60">
              © 2024 CORP AI. All rights reserved. Built with AI for the future of business.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
