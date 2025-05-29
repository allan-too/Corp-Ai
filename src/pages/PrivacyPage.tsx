
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPage = () => {
  const sections = [
    {
      title: 'Information We Collect',
      content: [
        'Account information (name, email, company details)',
        'Usage data and analytics',
        'API usage and performance metrics',
        'Customer support communications',
        'Payment and billing information'
      ]
    },
    {
      title: 'How We Use Your Information',
      content: [
        'Provide and improve our services',
        'Process payments and transactions',
        'Send important service updates',
        'Provide customer support',
        'Analyze usage patterns for product development'
      ]
    },
    {
      title: 'Data Security',
      content: [
        'End-to-end encryption for all data transmission',
        'SOC 2 Type II compliance',
        'Regular security audits and penetration testing',
        'Data backup and disaster recovery procedures',
        'Access controls and employee training'
      ]
    },
    {
      title: 'Your Rights',
      content: [
        'Access your personal data',
        'Correct inaccurate information',
        'Delete your account and data',
        'Data portability and export',
        'Opt-out of marketing communications'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 dark:from-background dark:via-background dark:to-neon-blue/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-foreground/70">
            Last updated: December 2024
          </p>
        </div>

        <div className="mb-8">
          <Card className="glass-card">
            <CardContent className="py-8">
              <p className="text-lg text-foreground/80 leading-relaxed">
                At CORP AI, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, and protect your information when you use our services. We are committed to transparency 
                and giving you control over your data.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={index} className="glass-card">
              <CardHeader>
                <CardTitle className="text-2xl text-neon-blue">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="text-neon-green mr-3 mt-0.5">•</span>
                      <span className="text-foreground/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-purple">Cookie Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 mb-4">
                We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie preferences through your browser settings.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg glass border border-white/10">
                  <h4 className="font-semibold text-foreground mb-2">Essential Cookies</h4>
                  <p className="text-sm text-foreground/60">Required for basic functionality</p>
                </div>
                <div className="text-center p-4 rounded-lg glass border border-white/10">
                  <h4 className="font-semibold text-foreground mb-2">Analytics Cookies</h4>
                  <p className="text-sm text-foreground/60">Help us improve our services</p>
                </div>
                <div className="text-center p-4 rounded-lg glass border border-white/10">
                  <h4 className="font-semibold text-foreground mb-2">Marketing Cookies</h4>
                  <p className="text-sm text-foreground/60">Personalize your experience</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-green">Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 mb-4">
                If you have any questions about this Privacy Policy or how we handle your data, please contact us:
              </p>
              <div className="space-y-2 text-foreground/70">
                <p><strong>Email:</strong> privacy@corpai.com</p>
                <p><strong>Address:</strong> 123 AI Street, Suite 100, San Francisco, CA 94105</p>
                <p><strong>Data Protection Officer:</strong> dpo@corpai.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
