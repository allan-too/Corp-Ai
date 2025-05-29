
import StudentTabs from '../../components/tools/StudentTabs';

const StudentAssistPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Assistant</h1>
          <p className="mt-2 text-gray-600">AI-powered tools for studying, writing, and learning</p>
        </div>
        
        <StudentTabs />
      </div>
    </div>
  );
};

export default StudentAssistPage;
