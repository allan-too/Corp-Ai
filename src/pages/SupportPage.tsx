
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const SupportPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    priority: 'medium',
    description: ''
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Searching...",
      description: `Looking for articles about "${searchQuery}"`,
    });
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Support Ticket Created",
      description: "We'll respond within 24 hours.",
    });
    setTicketForm({ subject: '', priority: 'medium', description: '' });
  };

  const faqs = [
    {
      question: 'How do I get started with CORP AI?',
      answer: 'Sign up for a free account, get your API key from the dashboard, and check out our Quick Start guide.'
    },
    {
      question: 'What are the API rate limits?',
      answer: 'Rate limits vary by plan: Starter (100 req/min), Professional (1000 req/min), Enterprise (unlimited).'
    },
    {
      question: 'How do I upgrade my plan?',
      answer: 'You can upgrade your plan anytime from your account settings. Changes take effect immediately.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! All plans include a 14-day free trial with full access to all features.'
    },
    {
      question: 'How secure is my data?',
      answer: 'We use enterprise-grade encryption and comply with SOC 2, GDPR, and other security standards.'
    },
    {
      question: 'Can I integrate with my existing tools?',
      answer: 'Yes, we offer APIs and integrations with popular tools like Slack, Salesforce, and more.'
    }
  ];

  const supportChannels = [
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Available 24/7 for immediate assistance',
      action: 'Start Chat',
      available: true
    },
    {
      icon: '📧',
      title: 'Email Support',
      description: 'Get detailed help via email',
      action: 'Send Email',
      available: true
    },
    {
      icon: '📞',
      title: 'Phone Support',
      description: 'Available for Enterprise customers',
      action: 'Call Now',
      available: false
    },
    {
      icon: '🎥',
      title: 'Screen Share',
      description: 'Schedule a 1-on-1 session',
      action: 'Book Session',
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 dark:from-background dark:via-background dark:to-neon-blue/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent mb-4">
            How can we help?
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
            Find answers in our knowledge base or get in touch with our support team
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-purple">
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Support Channels */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-neon-blue to-neon-green bg-clip-text text-transparent">
            Get Support
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => (
              <Card key={index} className={`glass-card group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                channel.available ? 'hover:shadow-neon-blue/30' : 'opacity-60'
              }`}>
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2 group-hover:animate-float">{channel.icon}</div>
                  <CardTitle className="text-foreground group-hover:text-neon-blue transition-colors">
                    {channel.title}
                  </CardTitle>
                  <CardDescription className="text-foreground/60">
                    {channel.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    className={`w-full ${
                      channel.available 
                        ? 'bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-blue' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    disabled={!channel.available}
                  >
                    {channel.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* FAQs */}
          <div>
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="glass-card hover:shadow-lg hover:shadow-neon-green/30 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground hover:text-neon-green transition-colors">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button variant="outline" asChild className="glass-card border-neon-green/50 hover:border-neon-cyan/50">
                <Link to="/documentation">View All Documentation</Link>
              </Button>
            </div>
          </div>

          {/* Support Ticket Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
              Create Support Ticket
            </h2>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-neon-purple">Submit a Support Request</CardTitle>
                <CardDescription>Can't find what you're looking for? We're here to help.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTicketSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                      required
                      rows={6}
                      className="mt-1"
                      placeholder="Please describe your issue in detail..."
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-pink hover:to-neon-purple">
                    Submit Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Status Section */}
        <div className="mt-16 text-center">
          <Card className="glass-card">
            <CardContent className="py-8">
              <h3 className="text-xl font-bold text-foreground mb-4">System Status</h3>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
                <span className="text-neon-green font-medium">All Systems Operational</span>
              </div>
              <p className="text-foreground/60 mb-4">
                Current response time: ~2 hours • Last incident: None
              </p>
              <Button variant="outline" className="glass-card border-neon-blue/50 hover:border-neon-purple/50">
                View Status Page
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
