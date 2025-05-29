
import ChatWidget from '../../components/tools/ChatWidget';
import { chatSupportApi } from '../../api/toolsApi';

const ChatSupportPage = () => {
  const handleChatMessage = async (message) => {
    const response = await chatSupportApi.sendMessage(message);
    return response.data.response;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Chat Support</h1>
          <p className="mt-2 text-gray-600">AI-powered customer support assistant</p>
        </div>

        <ChatWidget
          onSendMessage={handleChatMessage}
          title="Customer Support AI"
          placeholder="How can I help you today?"
        />
      </div>
    </div>
  );
};

export default ChatSupportPage;
