# CORP AI - Frontend Application

A production-ready React frontend for the CORP AI suite of business tools, built with TypeScript, Tailwind CSS, and shadcn/ui components.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- CORP AI Backend API running

### Installation
```bash
git clone <repository-url>
cd corp-ai-frontend
npm install
```

### Environment Setup
Create a `.env` file in the root directory:
```bash
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=CORP AI
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## 🏗️ Architecture

### Tech Stack
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router v6** for routing
- **React Hook Form + Zod** for form validation
- **Axios** for API communication
- **Recharts** for data visualization

### Project Structure
```
src/
├── api/                    # API client and tool endpoints
│   ├── client.ts          # Axios configuration
│   └── toolsApi.js        # Tool-specific API functions
├── components/
│   ├── layout/            # Navigation, layout components
│   ├── tools/             # Tool-specific components
│   ├── auth/              # Authentication components
│   └── ui/                # shadcn/ui components
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication state management
├── pages/
│   ├── auth/              # Login/Register pages
│   └── tools/             # Individual tool pages
├── routes/                # Route configuration
└── hooks/                 # Custom React hooks
```

## 🛠️ Available Tools

The application includes 19 fully integrated business tools:

| Tool | Route | Description |
|------|-------|-------------|
| CRM | `/tools/crm` | Customer relationship management |
| Sales Forecast | `/tools/sales-forecast` | Predictive sales analytics |
| Chat Support | `/tools/chat-support` | AI-powered customer support |
| Marketing | `/tools/marketing` | Campaign management |
| Social Media | `/tools/social-media` | Social media scheduling |
| Analytics | `/tools/analytics` | Business intelligence reports |
| HR Management | `/tools/hr` | Job posting and HR analytics |
| Contract Review | `/tools/contracts` | AI contract analysis |
| Finance Planner | `/tools/finance` | Budget planning and analysis |
| Supply Chain | `/tools/supply-chain` | Inventory optimization |
| Scheduler | `/tools/scheduler` | Appointment scheduling |
| Reviews | `/tools/reviews` | Review management |
| Accounting | `/tools/accounting` | Invoice generation |
| Inventory | `/tools/inventory` | Stock management |
| Legal CRM | `/tools/legal-crm` | Legal case management |
| Notifications | `/tools/notifications` | Automated notifications |
| Reservation | `/tools/reservation` | Booking management |
| Telco Analytics | `/tools/telco` | Telecommunications analytics |
| Student Assistant | `/tools/student-assist` | Educational AI tools |

## 📊 Frontend State Schema

### Authentication State
```typescript
interface AuthState {
  user: {
    id: number;
    email: string;
    role: string;
  } | null;
  token: string | null;
  loading: boolean;
}
```

### Tool Data Interfaces
```typescript
// CRM
interface Lead {
  id: string;
  name: string;
  contact: string;
  status: string;
  created_at: string;
}

// Sales Forecast
interface ForecastData {
  productId: string;
  period: number;
  forecast: Array<{
    month: string;
    projected_sales: number;
  }>;
}

// Finance
interface BudgetData {
  month: string;
  revenue: number;
  expenses: number;
  surplus: number;
}

// Telco
interface TelcoData {
  maintenance: {
    timeline: Array<{ date: string; issues: number }>;
    critical_issues: number;
    uptime_percentage: number;
  };
  churn: {
    monthly_churn: Array<{ month: string; churn_rate: number }>;
    current_rate: number;
    at_risk_customers: number;
  };
  fraud: {
    risk_distribution: Array<{ name: string; value: number }>;
    high_risk_calls: number;
    suspected_fraud: number;
  };
}

// Student Assistant
interface StudentData {
  uploadedFile: { id: string; filename: string } | null;
  summary: { summary: string } | null;
  flashcards: { cards: Array<{ question: string; answer: string }> } | null;
  writingImprovement: { improved_text: string } | null;
  citations: { apa: string; mla: string } | null;
  transcription: { text: string } | null;
}
```

## 🔗 API Integration

### Base Configuration
```typescript
// src/api/client.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatic token attachment
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Authentication Flow
1. User submits login credentials
2. Frontend calls `POST /auth/login`
3. JWT token stored in `localStorage`
4. Axios interceptor attaches token to all requests
5. Automatic redirect on 401 responses

### Tool API Examples
```typescript
// CRM - Create Lead
const response = await axios.post('/tools/crm', {
  name: 'John Doe',
  contact: 'john@example.com'
});

// Sales Forecast
const response = await axios.get('/tools/sales_forecast', {
  params: { product_id: 'PROD-001', period: 30 }
});

// File Upload (Telco/Student)
const formData = new FormData();
formData.append('file', file);
const response = await axios.post('/tools/telco/cdr/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

## 🎨 UI/UX Features

### Form Validation
- React Hook Form with Zod schemas
- Real-time validation feedback
- Loading states and success/error toasts
- Accessible form controls

### Data Visualization
- Interactive charts with Recharts
- Responsive tables with sorting/filtering
- Real-time data updates
- Export functionality (PDF/CSV)

### File Handling
- Drag-and-drop file uploads
- Progress indicators
- File type validation
- Bulk upload support

### Responsive Design
- Mobile-first approach
- Tailwind CSS utilities
- Collapsible sidebar navigation
- Touch-friendly interfaces

## 🔐 Security

### Authentication
- JWT token-based authentication
- Automatic token refresh handling
- Protected route components
- Role-based access control

### Data Protection
- Input sanitization
- XSS prevention
- CSRF protection via tokens
- Secure API communication

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Docker Deployment
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables
Required environment variables for production:
- `VITE_API_URL`: Backend API URL
- `VITE_APP_NAME`: Application name

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy Frontend
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test
      - name: Deploy to production
        run: # Your deployment script
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:coverage
```

## 📖 Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier configuration
- Conventional commit messages
- Component composition over inheritance

### Component Structure
```typescript
// Standard component template
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// ... other imports

interface Props {
  // Define props interface
}

const ComponentName = ({ prop }: Props) => {
  const navigate = useNavigate();
  const [state, setState] = useState();

  const handleAction = async () => {
    // Implementation
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

### State Management
- React Context for global state
- Local state for component-specific data
- Custom hooks for reusable logic
- Immutable state updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Submit a pull request
5. Code review and merge

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:
- GitHub Issues
- Documentation: [docs.example.com]
- Email: support@corpai.com

## 🔄 Frontend-Backend Integration

### Architecture Overview
The CORP AI application follows a modern client-server architecture:
- **Frontend**: React/TypeScript SPA with Tailwind CSS and shadcn/ui components
- **Backend**: FastAPI Python application with PostgreSQL database
- **Authentication**: JWT-based auth with OAuth support (Google, GitHub)

### API Integration
All frontend-backend communication happens through RESTful API endpoints:

#### Authentication
- `/auth/login` - Email/password authentication
- `/auth/register` - User registration with validation
- `/auth/oauth/{provider}` - OAuth authentication (Google, GitHub)
- `/auth/refresh` - JWT token refresh

#### Tools
- `/tools/finance/budget` - Budget creation and management
- `/tools/social_media` - Social media post scheduling
- `/tools/chat` - AI assistant conversations

### Data Flow
1. Frontend components use React Hook Form with Zod validation
2. API requests are made through Axios with interceptors for auth
3. Backend validates requests and interacts with the database
4. Responses are typed with Pydantic models for consistency

### Subscription-Based Access
Features are gated based on user subscription level:
- **Basic**: Limited tool access
- **Professional**: Access to HR, Reviews, Social Media tools
- **Enterprise**: Full access to all tools including Legal and Supply Chain

### Development Workflow
1. Backend endpoints are defined in FastAPI routers
2. Frontend API client methods are created in `src/api/`
3. Components consume API data through custom hooks
4. Authentication state is managed through AuthContext

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/93289a04-5492-42b0-9db3-2f99ceec614b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/93289a04-5492-42b0-9db3-2f99ceec614b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
# Corp-Ai
# CORP
# corp_
# CORP-AI
