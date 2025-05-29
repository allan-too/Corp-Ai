
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const CookiesPage = () => {
  const { toast } = useToast();
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
    personalization: true
  });

  const handleSavePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    toast({
      title: "Preferences Saved",
      description: "Your cookie preferences have been updated.",
    });
  };

  const cookieTypes = [
    {
      id: 'essential',
      title: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      examples: ['Authentication tokens', 'Security preferences', 'Form data'],
      required: true
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website.',
      examples: ['Google Analytics', 'Page views', 'User behavior tracking'],
      required: false
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies',
      description: 'These cookies are used to deliver personalized advertisements.',
      examples: ['Ad targeting', 'Conversion tracking', 'Social media pixels'],
      required: false
    },
    {
      id: 'personalization',
      title: 'Personalization Cookies',
      description: 'These cookies allow us to remember your preferences and customize your experience.',
      examples: ['Theme preferences', 'Language settings', 'Dashboard layout'],
      required: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 dark:from-background dark:via-background dark:to-neon-blue/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent mb-4">
            Cookie Settings
          </h1>
          <p className="text-xl text-foreground/70">
            Manage your cookie preferences and learn about how we use cookies
          </p>
        </div>

        {/* Cookie Preferences */}
        <div className="mb-12">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-cyan">Cookie Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {cookieTypes.map((cookieType) => (
                  <div key={cookieType.id} className="border-b border-white/10 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <Label htmlFor={cookieType.id} className="text-lg font-semibold text-foreground cursor-pointer">
                          {cookieType.title}
                        </Label>
                        {cookieType.required && (
                          <span className="ml-2 text-xs bg-neon-green/20 text-neon-green px-2 py-1 rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                      <Switch
                        id={cookieType.id}
                        checked={cookiePreferences[cookieType.id as keyof typeof cookiePreferences]}
                        onCheckedChange={(checked) => 
                          setCookiePreferences(prev => ({ ...prev, [cookieType.id]: checked }))
                        }
                        disabled={cookieType.required}
                      />
                    </div>
                    <p className="text-foreground/70 mb-3">{cookieType.description}</p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground/80">Examples:</p>
                      <ul className="text-sm text-foreground/60">
                        {cookieType.examples.map((example, index) => (
                          <li key={index} className="flex items-center">
                            <span className="text-neon-blue mr-2">•</span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleSavePreferences}
                  className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-purple hover:to-neon-cyan"
                >
                  Save Preferences
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setCookiePreferences({ essential: true, analytics: false, marketing: false, personalization: false })}
                  className="glass-card border-neon-blue/50 hover:border-neon-purple/50"
                >
                  Accept Only Essential
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setCookiePreferences({ essential: true, analytics: true, marketing: true, personalization: true })}
                  className="glass-card border-neon-green/50 hover:border-neon-cyan/50"
                >
                  Accept All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cookie Policy Information */}
        <div className="space-y-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-blue">What Are Cookies?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">
                Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
                They are widely used to make websites work more efficiently and to provide website owners with information 
                about how their site is being used.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-purple">How We Use Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-foreground/80">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">🔐 Security & Authentication</h4>
                  <p>Keep you logged in securely and protect against unauthorized access.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">📊 Analytics & Performance</h4>
                  <p>Understand how our website is used to improve performance and user experience.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">🎨 Personalization</h4>
                  <p>Remember your preferences like theme settings and dashboard layout.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">📢 Marketing</h4>
                  <p>Show you relevant content and measure the effectiveness of our campaigns.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-green">Managing Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed mb-4">
                You can control and manage cookies in several ways:
              </p>
              <ul className="space-y-2 text-foreground/80">
                <li className="flex items-start">
                  <span className="text-neon-green mr-3 mt-0.5">•</span>
                  Use the cookie preferences panel above to customize your settings
                </li>
                <li className="flex items-start">
                  <span className="text-neon-green mr-3 mt-0.5">•</span>
                  Configure your browser settings to block or delete cookies
                </li>
                <li className="flex items-start">
                  <span className="text-neon-green mr-3 mt-0.5">•</span>
                  Use browser extensions that manage cookie permissions
                </li>
                <li className="flex items-start">
                  <span className="text-neon-green mr-3 mt-0.5">•</span>
                  Clear your browser's cache and cookies periodically
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-cyan">Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="space-y-2 text-foreground/70">
                <p><strong>Email:</strong> privacy@corpai.com</p>
                <p><strong>Address:</strong> 123 AI Street, Suite 100, San Francisco, CA 94105</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;
