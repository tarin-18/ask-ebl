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
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-start justify-center">
        {/* EMI Calculator - Left Side */}
        <div className="w-full lg:w-80 lg:order-1 order-2">
          <EMICalculator />
        </div>
        
        {/* ChatBot - Center */}
        <div className="w-full max-w-2xl lg:order-2 order-1 mx-auto">
          <ChatBot initialMessage="Hello! I'm AskEBL, your EBL Banking Assistant. How can I help you today?" />
        </div>
        
        {/* Currency Converter - Right Side */}
        <div className="w-full lg:w-80 lg:order-3 order-3">
          <CurrencyConverter />
        </div>
      </div>
    </div>
  );
};

export default Index;
