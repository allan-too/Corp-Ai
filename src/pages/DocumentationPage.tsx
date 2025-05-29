
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const DocumentationPage = () => {
  const sections = [
    {
      title: 'Getting Started',
      icon: '🚀',
      items: [
        { title: 'Quick Start Guide', description: 'Get up and running in 5 minutes' },
        { title: 'Authentication', description: 'Setting up API keys and authentication' },
        { title: 'First API Call', description: 'Make your first request to CORP AI' }
      ]
    },
    {
      title: 'API Reference',
      icon: '📚',
      items: [
        { title: 'CRM API', description: 'Manage leads, contacts, and customer data' },
        { title: 'Analytics API', description: 'Access business intelligence and reporting' },
        { title: 'Marketing API', description: 'Campaign management and automation' }
      ]
    },
    {
      title: 'SDKs & Libraries',
      icon: '🛠️',
      items: [
        { title: 'JavaScript SDK', description: 'Official JavaScript/Node.js library' },
        { title: 'Python SDK', description: 'Python package for CORP AI integration' },
        { title: 'REST API', description: 'Direct HTTP API access' }
      ]
    },
    {
      title: 'Guides & Tutorials',
      icon: '📖',
      items: [
        { title: 'Integration Patterns', description: 'Best practices for common use cases' },
        { title: 'Webhook Setup', description: 'Real-time notifications and events' },
        { title: 'Error Handling', description: 'Robust error handling strategies' }
      ]
    }
  ];

  const codeExample = `// Initialize CORP AI client
import { CorpAI } from '@corp-ai/sdk';

const client = new CorpAI({
  apiKey: process.env.CORP_AI_API_KEY
});

// Create a new lead in CRM
const lead = await client.crm.createLead({
  name: 'John Doe',
  email: 'john@example.com',
  company: 'Acme Corp',
  source: 'website'
});

console.log('Lead created:', lead.id);`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 dark:from-background dark:via-background dark:to-neon-blue/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-blue to-neon-green bg-clip-text text-transparent mb-4">
            Documentation
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Everything you need to integrate CORP AI into your applications and workflows
          </p>
        </div>

        {/* Quick Start Section */}
        <div className="mb-16">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-blue">Quick Start</CardTitle>
              <CardDescription>Get started with CORP AI in minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">1. Install the SDK</h3>
                  <div className="bg-black/50 rounded-lg p-4 mb-4">
                    <code className="text-neon-green">npm install @corp-ai/sdk</code>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-4">2. Get your API key</h3>
                  <p className="text-foreground/70 mb-4">
                    Sign up for a free account and get your API key from the dashboard.
                  </p>
                  
                  <Button asChild className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-blue">
                    <Link to="/register">Get API Key</Link>
                  </Button>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">3. Make your first call</h3>
                  <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-neon-green whitespace-pre-wrap">
                      {codeExample}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {sections.map((section, index) => (
            <Card key={index} className="glass-card group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-neon-green/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="text-3xl group-hover:animate-float">{section.icon}</div>
                  <CardTitle className="text-xl text-foreground group-hover:text-neon-green transition-colors">
                    {section.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-l-2 border-neon-green/30 pl-4 hover:border-neon-green/60 transition-colors cursor-pointer">
                      <h4 className="font-medium text-foreground hover:text-neon-green transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-sm text-foreground/60">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* API Status */}
        <div className="mb-16">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-cyan">API Status & Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">🟢</div>
                  <h3 className="font-semibold text-foreground">API Status</h3>
                  <p className="text-neon-green">All Systems Operational</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="font-semibold text-foreground">Response Time</h3>
                  <p className="text-neon-cyan">~150ms average</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">📊</div>
                  <h3 className="font-semibold text-foreground">Uptime</h3>
                  <p className="text-neon-purple">99.9% (30 days)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Section */}
        <div className="text-center">
          <Card className="glass-card">
            <CardContent className="py-12">
              <h3 className="text-2xl font-bold text-foreground mb-4">Need Help?</h3>
              <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you integrate successfully.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-purple hover:to-neon-cyan">
                  <Link to="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="glass-card border-neon-blue/50 hover:border-neon-green/50">
                  <a href="https://github.com/corp-ai" target="_blank" rel="noopener noreferrer">
                    View on GitHub
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
