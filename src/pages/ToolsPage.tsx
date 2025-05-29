
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ToolsPage = () => {
  const tools = [
    { name: 'CRM', icon: '👥', path: '/tools/crm', desc: 'Manage customer relationships with AI insights' },
    { name: 'Sales Forecast', icon: '📈', path: '/tools/sales-forecast', desc: 'Predict sales trends with machine learning' },
    { name: 'Marketing', icon: '📢', path: '/tools/marketing', desc: 'Create targeted campaigns that convert' },
    { name: 'Finance Planner', icon: '💰', path: '/tools/finance', desc: 'Smart budgeting and financial planning' },
    { name: 'HR Management', icon: '👤', path: '/tools/hr', desc: 'Streamline workforce management' },
    { name: 'Analytics', icon: '📊', path: '/tools/analytics', desc: 'Deep business intelligence insights' },
    { name: 'Inventory', icon: '📦', path: '/tools/inventory', desc: 'Smart inventory optimization' },
    { name: 'Accounting', icon: '💼', path: '/tools/accounting', desc: 'Automated financial management' },
    { name: 'Supply Chain', icon: '🚚', path: '/tools/supply-chain', desc: 'Optimize logistics and procurement' },
    { name: 'Social Media', icon: '📱', path: '/tools/social-media', desc: 'AI-powered social management' },
    { name: 'Chat Support', icon: '💬', path: '/tools/chat-support', desc: '24/7 AI customer assistance' },
    { name: 'Reviews', icon: '⭐', path: '/tools/reviews', desc: 'Monitor and manage reputation' },
    { name: 'Notifications', icon: '🔔', path: '/tools/notifications', desc: 'Smart alert system' },
    { name: 'Reservations', icon: '📅', path: '/tools/reservations', desc: 'Intelligent booking management' },
    { name: 'Legal CRM', icon: '⚖️', path: '/tools/legal-crm', desc: 'Legal client management' },
    { name: 'Contracts', icon: '📋', path: '/tools/contracts', desc: 'AI contract analysis' },
    { name: 'Scheduler', icon: '🗓️', path: '/tools/scheduler', desc: 'Smart scheduling assistant' },
    { name: 'Telco Analytics', icon: '📞', path: '/tools/telco', desc: 'Telecommunications data analysis' },
    { name: 'Student Assistant', icon: '🎓', path: '/tools/student-assist', desc: 'AI-powered educational support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 dark:from-background dark:via-background dark:to-neon-blue/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent mb-4">
            All Tools
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Comprehensive AI-powered tools to transform every aspect of your business operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Link key={tool.path} to={tool.path}>
              <Card className="glass-card group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-neon-blue/30">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2 group-hover:animate-float">{tool.icon}</div>
                  <CardTitle className="text-foreground group-hover:text-neon-blue transition-colors">
                    {tool.name}
                  </CardTitle>
                  <CardDescription className="text-foreground/60">
                    {tool.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="glass-card border-neon-blue/50 hover:border-neon-purple/50 transition-all duration-300">
                    Explore Tool
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-green">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
