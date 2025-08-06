import { ChatBot } from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">EBL Banking Assistant</h1>
          <p className="text-lg text-gray-600">Ask me anything about banking services</p>
        </div>
        <ChatBot initialMessage="Hello! I'm your EBL Banking Assistant. How can I help you today?" />
      </div>
    </div>
  );
};

export default Index;
