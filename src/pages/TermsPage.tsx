
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 dark:from-background dark:via-background dark:to-neon-blue/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-foreground/70">
            Last updated: December 2024
          </p>
        </div>

        <div className="space-y-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-blue">1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">
                By accessing and using CORP AI services, you accept and agree to be bound by the terms and provision of this agreement. 
                These Terms of Service constitute a legally binding agreement between you and CORP AI.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-purple">2. Use License</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed mb-4">
                Permission is granted to use CORP AI services for commercial and personal purposes under the following conditions:
              </p>
              <ul className="space-y-2 text-foreground/80">
                <li className="flex items-start">
                  <span className="text-neon-green mr-3 mt-0.5">•</span>
                  Services must be used in compliance with applicable laws and regulations
                </li>
                <li className="flex items-start">
                  <span className="text-neon-green mr-3 mt-0.5">•</span>
                  You may not attempt to reverse engineer or circumvent our security measures
                </li>
                <li className="flex items-start">
                  <span className="text-neon-green mr-3 mt-0.5">•</span>
                  API usage must comply with rate limits and usage policies
                </li>
                <li className="flex items-start">
                  <span className="text-neon-green mr-3 mt-0.5">•</span>
                  You are responsible for maintaining the security of your account credentials
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-cyan">3. Service Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">
                While we strive for 99.9% uptime, CORP AI services are provided "as is" without warranty of any kind. 
                We reserve the right to modify, suspend, or discontinue any part of our services with reasonable notice. 
                Scheduled maintenance will be announced in advance when possible.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-green">4. Payment Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-foreground/80">
                <p><strong>Billing:</strong> Subscription fees are billed monthly or annually in advance.</p>
                <p><strong>Refunds:</strong> Refunds are available within 30 days of initial purchase for new customers.</p>
                <p><strong>Upgrades:</strong> Plan upgrades take effect immediately with prorated billing.</p>
                <p><strong>Cancellation:</strong> You may cancel your subscription at any time. Access continues until the end of the billing period.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-purple">5. Data and Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">
                Your data remains your property. We process data solely to provide our services as outlined in our Privacy Policy. 
                We implement industry-standard security measures to protect your information and comply with applicable data protection regulations including GDPR and CCPA.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-blue">6. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">
                CORP AI's liability is limited to the amount paid for services in the 12 months preceding any claim. 
                We are not liable for indirect, incidental, or consequential damages. Some jurisdictions do not allow 
                limitation of liability, so these limitations may not apply to you.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-cyan">7. Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">
                Either party may terminate this agreement at any time. Upon termination, your access to services will cease, 
                and we will provide a reasonable period for data export. We reserve the right to terminate accounts for 
                violation of these terms or misuse of services.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-green">8. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-foreground/70">
                <p><strong>Email:</strong> legal@corpai.com</p>
                <p><strong>Address:</strong> 123 AI Street, Suite 100, San Francisco, CA 94105</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
