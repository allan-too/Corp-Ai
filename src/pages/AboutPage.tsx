
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const team = [
    {
      name: 'Alex Chen',
      role: 'CEO & Founder',
      image: '👨‍💼',
      description: 'Former Google AI researcher with 10+ years in machine learning'
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      image: '👩‍💻',
      description: 'Ex-Tesla software architect, expert in scalable AI systems'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Product',
      image: '👨‍🔬',
      description: 'Previously at Microsoft, specialist in enterprise software'
    }
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Innovation First',
      description: 'We push the boundaries of what AI can achieve for businesses'
    },
    {
      icon: '🤝',
      title: 'Customer Success',
      description: 'Your success is our success. We build tools that truly make a difference'
    },
    {
      icon: '🔍',
      title: 'Transparency',
      description: 'Clear pricing, open communication, and honest about our capabilities'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 dark:from-background dark:via-background dark:to-neon-blue/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-blue to-neon-green bg-clip-text text-transparent mb-6">
            About CORP AI
          </h1>
          <p className="text-xl text-foreground/70 max-w-4xl mx-auto leading-relaxed">
            We're on a mission to democratize artificial intelligence for businesses of all sizes. 
            Founded in 2023, CORP AI brings enterprise-grade AI tools to companies worldwide, 
            making advanced automation accessible and affordable.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="glass-card">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-neon-purple mb-4">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
                To empower every business with intelligent automation tools that streamline operations, 
                boost productivity, and unlock new growth opportunities through the power of AI.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="glass-card group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-neon-green/30">
                <CardHeader className="text-center">
                  <div className="text-5xl mb-4 group-hover:animate-float">{value.icon}</div>
                  <CardTitle className="text-foreground group-hover:text-neon-green transition-colors">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-foreground/60">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
            Leadership Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="glass-card group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-neon-blue/30">
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4 group-hover:animate-float">{member.image}</div>
                  <CardTitle className="text-foreground group-hover:text-neon-blue transition-colors">
                    {member.name}
                  </CardTitle>
                  <CardDescription className="text-neon-purple font-semibold">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-foreground/60">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="glass-card">
            <CardContent className="py-12">
              <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Transform Your Business?</h3>
              <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
                Join thousands of companies already using CORP AI to automate their operations and drive growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-green">
                  <Link to="/register">Start Your Free Trial</Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="glass-card border-neon-green/50 hover:border-neon-cyan/50">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
