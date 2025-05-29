
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FeaturesPage = () => {
  const features = [
    {
      icon: '🤖',
      title: 'Advanced AI Integration',
      description: 'State-of-the-art machine learning algorithms power every tool for maximum efficiency.'
    },
    {
      icon: '🔒',
      title: 'Enterprise Security',
      description: 'Bank-level encryption and security protocols protect your sensitive business data.'
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Get instant insights with live dashboards and automated reporting features.'
    },
    {
      icon: '🔄',
      title: 'Seamless Integration',
      description: 'Connect with your existing tools and workflows through our robust API system.'
    },
    {
      icon: '📱',
      title: 'Mobile Responsive',
      description: 'Access all features on any device with our fully responsive design.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Optimized performance ensures quick load times and smooth user experience.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 dark:from-background dark:via-background dark:to-neon-blue/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-green to-neon-purple bg-clip-text text-transparent mb-4">
            Powerful Features
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Discover the cutting-edge capabilities that make CORP AI the ultimate business automation platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-neon-green/30">
              <CardHeader className="text-center">
                <div className="text-6xl mb-4 group-hover:animate-float">{feature.icon}</div>
                <CardTitle className="text-foreground group-hover:text-neon-green transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-foreground/60">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-neon-green to-neon-blue hover:from-neon-blue hover:to-neon-purple">
            <Link to="/register">Get Started Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
