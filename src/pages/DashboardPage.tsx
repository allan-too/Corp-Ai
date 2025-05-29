
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DashboardPage = () => {
  const { user } = useAuth();

  const toolCategories = [
    {
      category: "Sales & Customer Management",
      gradient: "from-neon-blue to-neon-purple",
      tools: [
        {
          name: "CRM",
          description: "Customer relationship management and lead tracking",
          path: "/tools/crm",
          icon: "👥",
          color: "neon-blue"
        },
        {
          name: "Sales Forecast",
          description: "AI-powered sales forecasting and pipeline analysis",
          path: "/tools/sales-forecast", 
          icon: "📈",
          color: "neon-green"
        },
        {
          name: "Chat Support",
          description: "AI customer support and ticket management",
          path: "/tools/chat-support",
          icon: "💬",
          color: "neon-purple"
        }
      ]
    },
    {
      category: "Marketing & Communication",
      gradient: "from-neon-purple to-neon-pink",
      tools: [
        {
          name: "Marketing",
          description: "Campaign management and marketing automation",
          path: "/tools/marketing",
          icon: "📢",
          color: "neon-pink"
        },
        {
          name: "Social Media",
          description: "Social media management and analytics",
          path: "/tools/social-media",
          icon: "📱",
          color: "neon-purple"
        },
        {
          name: "Reviews",
          description: "Review management and sentiment analysis",
          path: "/tools/reviews",
          icon: "⭐",
          color: "neon-cyan"
        }
      ]
    },
    {
      category: "Finance & Operations",
      gradient: "from-neon-green to-neon-cyan",
      tools: [
        {
          name: "Finance",
          description: "Financial planning and budget management",
          path: "/tools/finance",
          icon: "💰",
          color: "neon-green"
        },
        {
          name: "Accounting",
          description: "Accounting automation and reporting",
          path: "/tools/accounting", 
          icon: "🧮",
          color: "neon-blue"
        },
        {
          name: "Contracts",
          description: "Contract management and analysis",
          path: "/tools/contracts",
          icon: "📄",
          color: "neon-purple"
        }
      ]
    },
    {
      category: "Human Resources",
      gradient: "from-neon-cyan to-neon-blue",
      tools: [
        {
          name: "HR Management",
          description: "Employee management and HR analytics",
          path: "/tools/hr",
          icon: "👤",
          color: "neon-cyan"
        },
        {
          name: "Scheduler",
          description: "Employee scheduling and time management",
          path: "/tools/scheduler",
          icon: "📅",
          color: "neon-blue"
        }
      ]
    },
    {
      category: "Operations & Analytics",
      gradient: "from-neon-pink to-neon-green",
      tools: [
        {
          name: "Analytics",
          description: "Business intelligence and data analytics",
          path: "/tools/analytics",
          icon: "📊",
          color: "neon-purple"
        },
        {
          name: "Supply Chain",
          description: "Supply chain optimization and tracking",
          path: "/tools/supply-chain",
          icon: "🚚",
          color: "neon-blue"
        },
        {
          name: "Inventory",
          description: "Inventory management and optimization",
          path: "/tools/inventory",
          icon: "📦",
          color: "neon-green"
        }
      ]
    },
    {
      category: "Specialized Tools",
      gradient: "from-neon-purple to-neon-cyan",
      tools: [
        {
          name: "Legal CRM",
          description: "Legal case management and client tracking",
          path: "/tools/legal-crm",
          icon: "⚖️",
          color: "neon-purple"
        },
        {
          name: "Notifications",
          description: "Automated notification management",
          path: "/tools/notifications",
          icon: "🔔",
          color: "neon-blue"
        },
        {
          name: "Reservation",
          description: "Booking and reservation management",
          path: "/tools/reservation",
          icon: "🏨",
          color: "neon-green"
        },
        {
          name: "Telco",
          description: "Telecommunications management and analytics",
          path: "/tools/telco",
          icon: "📞",
          color: "neon-cyan"
        },
        {
          name: "Student Assist",
          description: "Educational support and student management",
          path: "/tools/student-assist",
          icon: "🎓",
          color: "neon-pink"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 dark:from-background dark:via-background dark:to-neon-blue/5 relative">
      {/* Animated background pattern */}
      <div className="absolute inset-0 circuit-bg opacity-20" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green bg-clip-text text-transparent mb-4">
            Welcome back, {user?.email?.split('@')[0]}
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Your AI-powered business command center. Choose a tool to transform your operations.
          </p>
        </div>

        {/* Tool Categories */}
        {toolCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-16">
            <div className="flex items-center mb-8">
              <div className={`h-1 flex-1 bg-gradient-to-r ${category.gradient} rounded-full mr-4`} />
              <h2 className={`text-2xl md:text-3xl font-semibold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent whitespace-nowrap`}>
                {category.category}
              </h2>
              <div className={`h-1 flex-1 bg-gradient-to-r ${category.gradient} rounded-full ml-4`} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.tools.map((tool, toolIndex) => (
                <Card 
                  key={toolIndex} 
                  className="glass-card group cursor-pointer transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-neon-blue/20 border border-white/20 dark:border-white/10"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`text-4xl transform group-hover:scale-110 group-hover:animate-float transition-all duration-300`}>
                        {tool.icon}
                      </div>
                      <div className={`w-3 h-3 rounded-full bg-${tool.color} shadow-lg shadow-${tool.color}/50 group-hover:shadow-lg group-hover:shadow-${tool.color}/80 transition-all duration-300`} />
                    </div>
                    <CardTitle className="text-lg group-hover:text-neon-blue transition-colors duration-300">
                      {tool.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-foreground/60 group-hover:text-foreground/80 transition-colors duration-300">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      asChild 
                      className="w-full bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 hover:from-neon-blue hover:to-neon-purple border border-neon-blue/30 hover:border-neon-purple/50 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-neon-blue/30"
                    >
                      <Link to={tool.path} className="flex items-center justify-center space-x-2">
                        <span>Launch {tool.name}</span>
                        <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Quick Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                19+
              </div>
              <p className="text-foreground/60 mt-1">AI-Powered Tools</p>
            </CardContent>
          </Card>
          <Card className="glass-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent">
                6
              </div>
              <p className="text-foreground/60 mt-1">Business Categories</p>
            </CardContent>
          </Card>
          <Card className="glass-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
                ∞
              </div>
              <p className="text-foreground/60 mt-1">Possibilities</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
