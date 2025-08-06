import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useFAQs } from "@/hooks/useBankingData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
  isQuestion?: boolean; // For suggestion prompts
  originalQuestion?: string; // Store the original question for suggestions
}

interface ChatBotProps {
  initialMessage?: string;
}

export function ChatBot({ initialMessage }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: initialMessage || 'Hello! I\'m AskEBL, your banking assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [awaitingSuggestion, setAwaitingSuggestion] = useState<string | null>(null);
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
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    // Check if this is a response to a suggestion prompt
    if (awaitingSuggestion) {
      const response = currentInput.toLowerCase().trim();
      if (response === 'yes' || response === 'y') {
        // Save suggestion to database
        try {
          const { error } = await supabase
            .from('suggested_faqs')
            .insert({
              question: awaitingSuggestion,
              suggested_by_session: sessionId
            });

          if (error) throw error;

          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: "Thank you! Your question has been submitted to our admin team. They will review it and may add it to our FAQ database soon. Is there anything else I can help you with?",
            sender: 'bot',
            timestamp: new Date()
          };

          setTimeout(() => {
            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
            setAwaitingSuggestion(null);
          }, 1000);

          toast({
            title: "Question Submitted",
            description: "Your suggestion has been sent to our admin team for review.",
          });

        } catch (error) {
          console.error('Error saving suggestion:', error);
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: "I'm sorry, there was an error submitting your suggestion. Please try again later. Is there anything else I can help you with?",
            sender: 'bot',
            timestamp: new Date()
          };

          setTimeout(() => {
            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
            setAwaitingSuggestion(null);
          }, 1000);
        }

      } else if (response === 'no' || response === 'n') {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "No problem! Is there anything else I can help you with? You can ask about loans, accounts, credit cards, or any other banking services.",
          sender: 'bot',
          timestamp: new Date()
        };

        setTimeout(() => {
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
          setAwaitingSuggestion(null);
        }, 1000);

      } else {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Please respond with 'Yes' or 'No' only. Would you like me to suggest your question to our admin team to add to our FAQ database?",
          sender: 'bot',
          timestamp: new Date(),
          isQuestion: true,
          originalQuestion: awaitingSuggestion
        };

        setTimeout(() => {
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
        }, 1000);
      }
      return;
    }

    // Normal FAQ processing
    setTimeout(() => {
      const bestMatch = findBestMatch(currentInput);
      
      let botResponse = '';
      if (bestMatch) {
        botResponse = bestMatch.answer;
        setAwaitingSuggestion(null);
      } else {
        // No match found - ask for suggestion
        botResponse = `I apologize, but I couldn't find a specific answer to your question: "${currentInput}"

Would you like me to suggest this question to our admin team so they can add it to our FAQ database? This will help us serve you and other customers better in the future.

Please respond with 'Yes' or 'No'.`;
        setAwaitingSuggestion(currentInput);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        isQuestion: !bestMatch,
        originalQuestion: !bestMatch ? currentInput : undefined
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
    if (awaitingSuggestion) {
      setAwaitingSuggestion(null); // Clear any pending suggestion
    }
    setInputText(question);
    // Trigger send after setting the input
    setTimeout(() => {
      handleSendMessage();
    }, 100);
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
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center gap-4">
        <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20">
          <img 
            src="/src/assets/chat head.jpeg" 
            alt="EBL Chat Assistant" 
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">EBL Banking Assistant</h1>
          <p className="text-blue-100">Get instant help with all your banking needs</p>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Popular Questions:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "What types of loans do you offer?",
            "What types of accounts can I open?",
            "How can I apply for a credit card?",
            "What are your interest rates?",
            "How do I activate mobile banking?",
            "What documents do I need?",
            "How do I report a lost card?",
            "What are your service charges?"
          ].map((question) => (
            <Button
              key={question}
              variant="outline"
              size="sm"
              onClick={() => handleQuickQuestion(question)}
              className="text-xs p-3 h-auto hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-left justify-start"
            >
              {question}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-3 max-w-[85%] ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                message.sender === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-blue-600 border-2 border-blue-100'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
              </div>
              <div className={`rounded-2xl p-4 shadow-sm max-w-full ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white ml-2'
                  : 'bg-white text-gray-800 border border-gray-200 mr-2'
              }`}>
                <div className="text-sm leading-relaxed">
                  {formatMessageText(message.text)}
                </div>
                {message.isQuestion && awaitingSuggestion && (
                  <div className="mt-3 flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setInputText('Yes');
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 text-xs"
                    >
                      Yes
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setInputText('No');
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-1 text-xs"
                    >
                      No
                    </Button>
                  </div>
                )}
                <div className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
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
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white text-blue-600 border-2 border-blue-100 rounded-full flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm text-gray-600">Typing...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex gap-3">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={awaitingSuggestion ? "Type 'Yes' or 'No' to respond..." : "Ask me about loans, accounts, credit cards, or any banking service..."}
            className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl px-4 py-3 text-sm h-12"
            disabled={isTyping}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputText.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 py-3 h-12 transition-all duration-200"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-gray-600 mt-3 text-center">
          {awaitingSuggestion 
            ? "Please respond with 'Yes' or 'No' only" 
            : "Press Enter to send • Get instant answers to all your banking questions"
          }
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