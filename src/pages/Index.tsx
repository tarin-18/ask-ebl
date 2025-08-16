import { ChatBot } from "@/components/ChatBot";
import EMICalculator from "@/components/EMICalculator";
import CurrencyConverter from "@/components/CurrencyConverter";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <img src="src/assets/ebl logo ss.png" alt="EBL Logo" className="h-20 w-auto" />
        </div>
        <p className="text-lg text-gray-600">Ask anything about banking services</p>
      </div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* EMI Calculator - Left Side */}
        <div className="order-2 lg:order-1">
          <EMICalculator />
        </div>
        
        {/* ChatBot - Center */}
        <div className="order-1 lg:order-2">
          <ChatBot initialMessage="Hello! I'm AskEBL, your EBL Banking Assistant. How can I help you today?" />
        </div>
        
        {/* Currency Converter - Right Side */}
        <div className="order-3 lg:order-3">
          <CurrencyConverter />
        </div>
      </div>
    </div>
  );
};

export default Index;
