
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for small businesses getting started with AI',
      features: [
        'Up to 5 tools',
        '1,000 API calls/month',
        'Email support',
        'Basic analytics',
        '1 user account'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      description: 'Ideal for growing businesses that need more power',
      features: [
        'All 19 tools included',
        '10,000 API calls/month',
        'Priority support',
        'Advanced analytics',
        'Up to 10 user accounts',
        'Custom integrations'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Tailored solutions for large organizations',
      features: [
        'Unlimited tool access',
        'Unlimited API calls',
        '24/7 dedicated support',
        'White-label options',
        'Unlimited user accounts',
        'Custom development',
        'On-premise deployment'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 dark:from-background dark:via-background dark:to-neon-blue/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent mb-4">
            Simple Pricing
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Choose the perfect plan for your business needs. All plans include our core AI features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <Card key={index} className={`glass-card group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg relative ${
              plan.popular ? 'ring-2 ring-neon-purple shadow-lg shadow-neon-purple/30' : 'hover:shadow-neon-cyan/30'
            }`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-neon-purple to-neon-cyan text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-foreground group-hover:text-neon-cyan transition-colors">
                  {plan.name}
                </CardTitle>
                <div className="my-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-foreground/60">{plan.period}</span>
                </div>
                <CardDescription className="text-foreground/60">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-foreground/80">
                      <span className="text-neon-green mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-purple' 
                      : 'glass-card border-neon-cyan/50 hover:border-neon-purple/50'
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  asChild
                >
                  <Link to="/register">
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-foreground/60 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <Button variant="outline" asChild className="glass-card border-neon-blue/50 hover:border-neon-purple/50">
            <Link to="/contact">Have questions? Contact us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
