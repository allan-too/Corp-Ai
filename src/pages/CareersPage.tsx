
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CareersPage = () => {
  const positions = [
    {
      title: 'Senior AI Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      description: 'Lead the development of our core AI algorithms and machine learning models.'
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      description: 'Design intuitive user experiences for our AI-powered business tools.'
    },
    {
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Scale our infrastructure to handle millions of AI requests per day.'
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'New York, NY / Remote',
      type: 'Full-time',
      description: 'Help our enterprise clients maximize their success with CORP AI tools.'
    }
  ];

  const benefits = [
    {
      icon: '💰',
      title: 'Competitive Salary',
      description: 'Top-tier compensation packages with equity options'
    },
    {
      icon: '🏥',
      title: 'Health & Wellness',
      description: 'Comprehensive health, dental, and vision insurance'
    },
    {
      icon: '🏠',
      title: 'Remote-First',
      description: 'Work from anywhere with flexible schedule options'
    },
    {
      icon: '📚',
      title: 'Learning Budget',
      description: '$2,000 annual budget for courses, conferences, and books'
    },
    {
      icon: '🌴',
      title: 'Unlimited PTO',
      description: 'Take the time you need to recharge and stay productive'
    },
    {
      icon: '💻',
      title: 'Top Equipment',
      description: 'Latest MacBook Pro and any tools you need to succeed'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 dark:from-background dark:via-background dark:to-neon-blue/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Help us build the future of AI-powered business automation. Join a team of passionate innovators 
            working on cutting-edge technology that's transforming how companies operate.
          </p>
        </div>

        {/* Culture Section */}
        <div className="mb-16">
          <Card className="glass-card">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-neon-purple mb-4">Our Culture</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-foreground/80 max-w-3xl mx-auto mb-6">
                We're building an inclusive, diverse team where everyone can do their best work. 
                Our culture is built on transparency, continuous learning, and making a real impact 
                on businesses worldwide.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">🚀</div>
                  <h3 className="font-semibold text-foreground">Innovation</h3>
                  <p className="text-sm text-foreground/60">Push boundaries and think big</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🤝</div>
                  <h3 className="font-semibold text-foreground">Collaboration</h3>
                  <p className="text-sm text-foreground/60">Work together towards common goals</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🎯</div>
                  <h3 className="font-semibold text-foreground">Impact</h3>
                  <p className="text-sm text-foreground/60">Make a difference in the world</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-neon-blue to-neon-green bg-clip-text text-transparent">
            Benefits & Perks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="glass-card group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-neon-blue/30">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2 group-hover:animate-float">{benefit.icon}</div>
                  <CardTitle className="text-foreground group-hover:text-neon-blue transition-colors">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-foreground/60">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Open Positions
          </h2>
          <div className="space-y-6">
            {positions.map((position, index) => (
              <Card key={index} className="glass-card hover:shadow-lg hover:shadow-neon-purple/30 transition-all duration-300">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="text-xl text-foreground hover:text-neon-purple transition-colors">
                        {position.title}
                      </CardTitle>
                      <CardDescription className="text-neon-cyan font-medium">
                        {position.department} • {position.location} • {position.type}
                      </CardDescription>
                    </div>
                    <Button className="mt-4 md:mt-0 bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-purple">
                      Apply Now
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70">{position.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="glass-card">
            <CardContent className="py-12">
              <h3 className="text-2xl font-bold text-foreground mb-4">Don't See Your Role?</h3>
              <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
                We're always looking for talented people to join our team. Send us your resume and let us know how you'd like to contribute.
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-neon-green to-neon-cyan hover:from-neon-cyan hover:to-neon-green">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;
