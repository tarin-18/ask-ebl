import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useFAQs } from "@/hooks/useBankingData";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatBotProps {
  initialMessage?: string;
}

export function ChatBot({ initialMessage }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: initialMessage || 'Hello! I\'m AskEBL, your Eastern Bank assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: faqs } = useFAQs();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestMatch = (userInput: string) => {
    if (!faqs) return null;

    const input = userInput.toLowerCase();
    const words = input.split(' ').filter(word => word.length > 2);
    
    let bestMatch = null;
    let highestScore = 0;

    for (const faq of faqs) {
      let score = 0;
      
      // Check question match
      const questionWords = faq.question.toLowerCase().split(' ');
      for (const word of words) {
        if (faq.question.toLowerCase().includes(word)) {
          score += 2;
        }
      }
      
      // Check keywords match
      if (faq.keywords) {
        for (const keyword of faq.keywords) {
          for (const word of words) {
            if (keyword.toLowerCase().includes(word) || word.includes(keyword.toLowerCase())) {
              score += 3;
            }
          }
        }
      }
      
      // Exact phrase matching
      if (faq.question.toLowerCase().includes(input) || input.includes(faq.question.toLowerCase())) {
        score += 5;
      }

      if (score > highestScore && score > 2) {
        highestScore = score;
        bestMatch = faq;
      }
    }

    return bestMatch;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const bestMatch = findBestMatch(inputText);
      
      let botResponse = '';
      if (bestMatch) {
        botResponse = bestMatch.answer;
      } else {
        botResponse = `I apologize, but I couldn't find a specific answer to your question. Here are some things I can help you with:

• ATM withdrawal limits and services
• Account balance inquiries  
• Bank operating hours
• Interest rates information
• Loan applications and processes
• Money transfer charges
• Mobile banking activation
• Account opening requirements

Please try asking about any of these topics, or contact our customer service at 16236 for further assistance.`;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-brand text-brand-foreground p-4 flex items-center gap-3">
        <div className="w-12 h-12 bg-brand-foreground/10 rounded-full flex items-center justify-center border-2 border-brand-foreground/20">
          <div className="w-8 h-8 bg-brand-foreground rounded-full flex items-center justify-center">
            <span className="text-brand text-xs font-bold">EBL</span>
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">AskEBL - Banking Assistant</h1>
          <p className="text-sm opacity-90">Eastern Bank Limited • Independent University Bangladesh</p>
        </div>
        <div className="w-10 h-10 bg-brand-foreground/10 rounded-full flex items-center justify-center">
          <span className="text-brand-foreground text-xs font-bold">IUB</span>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="p-4 border-b bg-muted/30">
        <h3 className="text-sm font-medium mb-3">Quick Questions:</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "What are the card services?",
            "Bank operating hours?",
            "How to check balance?",
            "Foreign exchange rates?",
            "How to apply for loan?"
          ].map((question) => (
            <Button
              key={question}
              variant="outline"
              size="sm"
              onClick={() => handleQuickQuestion(question)}
              className="text-xs"
            >
              {question}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-2 max-w-[80%] ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div className={`rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground ml-2'
                  : 'bg-card border mr-2'
              }`}>
                <div className="text-sm">
                  {formatMessageText(message.text)}
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString('en-BD', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-card border rounded-lg p-3">
                <div className="flex items-center gap-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Typing...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about Eastern Bank..."
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputText.trim() || isTyping}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send • Ask about ATM limits, rates, loans, and more!
        </p>
      </div>

      {/* FAQ Accordion - Hidden but can be shown */}
      {faqs && faqs.length > 0 && (
        <div className="hidden">
          <Card className="m-4">
            <CardHeader>
              <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      {formatMessageText(faq.answer)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}