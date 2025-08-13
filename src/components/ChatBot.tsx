import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useFAQs } from "@/hooks/useBankingData";
import { usePopularQuestions } from "@/hooks/usePopularQuestions";
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
  isCardSelection?: boolean; // For card type selection
  cardOptions?: string[]; // Available card options
  isAccountSelection?: boolean; // For account type selection
  accountOptions?: string[]; // Available account options
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
  const [awaitingCardSelection, setAwaitingCardSelection] = useState(false);
  const [awaitingAccountSelection, setAwaitingAccountSelection] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: faqs } = useFAQs();
  const { data: popularQuestions } = usePopularQuestions();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const cardTypes = [
    "Credit Card",
    "Debit Card", 
    "Corporate Card",
    "Prepaid Card",
    "Islamic Credit Card"
  ];

  const accountTypes = [
    "Savings Account",
    "Current Account",
    "Fixed Deposit Account",
    "Student Account",
    "Islamic Savings Account",
    "Foreign Currency Account"
  ];

  const cardInfo = {
    "Credit Card": "EBL Credit Cards offer worldwide acceptance with attractive rewards, cashback, and exclusive privileges. Features include EMI facilities, balance transfer options, and comprehensive insurance coverage. Annual fees vary by card type with competitive interest rates.",
    "Debit Card": "EBL Debit Cards provide instant access to your account funds with ATM withdrawals, online purchases, and POS transactions. Features include contactless payments, international usage, and real-time SMS alerts for all transactions.",
    "Corporate Card": "EBL Corporate Cards are designed for business expenses with centralized billing, expense tracking, and detailed monthly statements. Benefits include higher credit limits, business rewards, and comprehensive reporting for accounting purposes.",
    "Prepaid Card": "EBL Prepaid Cards offer secure payment solutions without requiring a bank account. Load money as needed, control spending, and enjoy the convenience of card payments with enhanced security features.",
    "Islamic Credit Card": "EBL Islamic Credit Cards are Shariah-compliant financial products offering ethical banking solutions. Features include profit-sharing instead of interest, halal reward programs, and compliance with Islamic financial principles."
  };

  const accountInfo = {
    "Savings Account": "EBL Savings Account offers competitive interest rates with flexible deposit and withdrawal options. Features include free ATM transactions, online banking, mobile banking, and SMS alerts. Minimum balance requirements apply with attractive monthly profit rates.",
    "Current Account": "EBL Current Account is designed for frequent transactions with no transaction limits. Perfect for businesses and individuals with high transaction volumes. Features include checkbook facility, overdraft options, and dedicated relationship manager.",
    "Fixed Deposit Account": "EBL Fixed Deposit Account offers guaranteed returns with flexible tenure options from 1 month to 5 years. Higher interest rates than savings accounts, with premature encashment facility. Choose from monthly, quarterly, or maturity profit payments.",
    "Student Account": "EBL Student Account is specially designed for students with zero balance requirements and reduced charges. Features include free debit card, online banking, student loan facilities, and educational discounts at partner merchants.",
    "Islamic Savings Account": "EBL Islamic Savings Account is Shariah-compliant offering ethical banking solutions. Features include profit-sharing based on Islamic principles, halal investment options, and compliance with Shariah guidelines. No interest-based transactions.",
    "Foreign Currency Account": "EBL Foreign Currency Account allows you to maintain balances in major foreign currencies including USD, EUR, GBP. Features include competitive exchange rates, international wire transfers, and protection against currency fluctuations."
  };

  const isCardQuery = (userInput: string) => {
    const input = userInput.toLowerCase();
    const cardKeywords = ['card', 'cards', 'credit card', 'debit card', 'corporate card', 'prepaid card', 'islamic card'];
    return cardKeywords.some(keyword => input.includes(keyword));
  };

  const isAccountQuery = (userInput: string) => {
    const input = userInput.toLowerCase();
    const accountKeywords = ['account', 'accounts', 'savings account', 'current account', 'fixed deposit', 'student account', 'islamic savings', 'foreign currency'];
    return accountKeywords.some(keyword => input.includes(keyword));
  };

  const findBestMatch = (userInput: string) => {
    // Check if this is a card-related query
    if (isCardQuery(userInput)) {
      return 'CARD_QUERY';
    }

    // Check if this is an account-related query
    if (isAccountQuery(userInput)) {
      return 'ACCOUNT_QUERY';
    }

    // First check FAQs
    if (faqs) {
      const faqMatch = findBestMatchInCollection(userInput, faqs);
      if (faqMatch) return faqMatch;
    }

    // Then check popular questions
    if (popularQuestions) {
      const popularMatch = findBestMatchInCollection(userInput, popularQuestions);
      if (popularMatch) return popularMatch;
    }

    return null;
  };

  const findBestMatchInCollection = (userInput: string, collection: any[]) => {
    const input = userInput.toLowerCase();
    const words = input.split(' ').filter(word => word.length > 2);
    
    let bestMatch = null;
    let highestScore = 0;

    for (const item of collection) {
      let score = 0;
      
      // Check question match
      const questionWords = item.question.toLowerCase().split(' ');
      for (const word of words) {
        if (item.question.toLowerCase().includes(word)) {
          score += 2;
        }
      }
      
      // Check keywords match
      if (item.keywords) {
        for (const keyword of item.keywords) {
          for (const word of words) {
            if (keyword.toLowerCase().includes(word) || word.includes(keyword.toLowerCase())) {
              score += 3;
            }
          }
        }
      }
      
      // Exact phrase matching
      if (item.question.toLowerCase().includes(input) || input.includes(item.question.toLowerCase())) {
        score += 5;
      }

      if (score > highestScore && score > 3) { // Increased threshold to 3 for better matches
        highestScore = score;
        bestMatch = item;
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

    // Check if this is a card selection response
    if (awaitingCardSelection) {
      const selectedCard = cardTypes.find(card => 
        card.toLowerCase() === currentInput.toLowerCase() ||
        currentInput.toLowerCase().includes(card.toLowerCase())
      );

      if (selectedCard) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: cardInfo[selectedCard as keyof typeof cardInfo],
          sender: 'bot',
          timestamp: new Date()
        };

        setTimeout(() => {
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
          setAwaitingCardSelection(false);
        }, 1000);
      } else {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Please select one of the card types I mentioned: Credit Card, Debit Card, Corporate Card, Prepaid Card, or Islamic Credit Card.",
          sender: 'bot',
          timestamp: new Date(),
          isCardSelection: true,
          cardOptions: cardTypes
        };

        setTimeout(() => {
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
        }, 1000);
      }
      return;
    }

    // Check if this is an account selection response
    if (awaitingAccountSelection) {
      const selectedAccount = accountTypes.find(account => 
        account.toLowerCase() === currentInput.toLowerCase() ||
        currentInput.toLowerCase().includes(account.toLowerCase())
      );

      if (selectedAccount) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: accountInfo[selectedAccount as keyof typeof accountInfo],
          sender: 'bot',
          timestamp: new Date()
        };

        setTimeout(() => {
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
          setAwaitingAccountSelection(false);
        }, 1000);
      } else {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Please select one of the account types I mentioned: Savings Account, Current Account, Fixed Deposit Account, Student Account, Islamic Savings Account, or Foreign Currency Account.",
          sender: 'bot',
          timestamp: new Date(),
          isAccountSelection: true,
          accountOptions: accountTypes
        };

        setTimeout(() => {
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
        }, 1000);
      }
      return;
    }

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
      let isCard = false;
      let isAccount = false;
      if (bestMatch === 'CARD_QUERY') {
        botResponse = "I'd be happy to help you with information about our cards! Please select which type of card you'd like to know about:";
        isCard = true;
        setAwaitingCardSelection(true);
        setAwaitingSuggestion(null);
      } else if (bestMatch === 'ACCOUNT_QUERY') {
        botResponse = "I'd be happy to help you with information about our accounts! Please select which type of account you'd like to know about:";
        isAccount = true;
        setAwaitingAccountSelection(true);
        setAwaitingSuggestion(null);
      } else if (bestMatch) {
        botResponse = bestMatch.answer;
        setAwaitingSuggestion(null);
      } else {
        // No match found - ask for suggestion (no irrelevant answers)
        botResponse = `I couldn't find a specific answer to your question: "${currentInput}"

Would you like me to suggest this question to our admin team so they can add it to our FAQ database? This will help us serve you and other customers better.

Please respond with 'Yes' or 'No'.`;
        setAwaitingSuggestion(currentInput);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        isQuestion: !bestMatch && !isCard && !isAccount,
        originalQuestion: !bestMatch && !isCard && !isAccount ? currentInput : undefined,
        isCardSelection: isCard,
        cardOptions: isCard ? cardTypes : undefined,
        isAccountSelection: isAccount,
        accountOptions: isAccount ? accountTypes : undefined
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
    if (awaitingCardSelection) {
      setAwaitingCardSelection(false); // Clear any pending card selection
    }
    if (awaitingAccountSelection) {
      setAwaitingAccountSelection(false); // Clear any pending account selection
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
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-white p-6 flex items-center gap-4">
        <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20">
          <img 
            src="/src/assets/chat head.jpeg" 
            alt="EBL Chat Assistant" 
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">AskEBL - Your Banking Assistant</h1>
          <p className="text-primary-foreground/80">Get instant help with all your banking needs</p>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="p-6 bg-gradient-to-r from-accent/10 to-accent/20 border-b">
        <h3 className="text-sm font-semibold text-primary mb-4">Popular Questions:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {popularQuestions?.slice(0, 9).map((question) => (
            <Button
              key={question.id}
              variant="outline"
              size="sm"
              onClick={() => handleQuickQuestion(question.question)}
              className="text-xs p-3 h-auto bg-accent/90 hover:bg-accent border-accent/80 hover:border-accent text-accent-foreground transition-all duration-200 text-left justify-start font-medium"
            >
              {question.question}
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
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-white text-primary border-2 border-primary/20'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
              </div>
              <div className={`rounded-2xl p-4 shadow-sm max-w-full ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground ml-2'
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
                {message.isCardSelection && awaitingCardSelection && message.cardOptions && (
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {message.cardOptions.map((cardType) => (
                      <Button 
                        key={cardType}
                        size="sm" 
                        onClick={() => {
                          setInputText(cardType);
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 text-xs justify-start"
                      >
                        {cardType}
                      </Button>
                    ))}
                  </div>
                )}
                {message.isAccountSelection && awaitingAccountSelection && message.accountOptions && (
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {message.accountOptions.map((accountType) => (
                      <Button 
                        key={accountType}
                        size="sm" 
                        onClick={() => {
                          setInputText(accountType);
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 text-xs justify-start"
                      >
                        {accountType}
                      </Button>
                    ))}
                  </div>
                )}
                <div className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-primary-foreground/70' : 'text-gray-500'
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
              <div className="w-10 h-10 bg-white text-primary border-2 border-primary/20 rounded-full flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-gray-600">Typing...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t bg-gradient-to-r from-accent/10 to-accent/20">
        <div className="flex gap-3">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={awaitingSuggestion ? "Type 'Yes' or 'No' to respond..." : "Ask me about loans, accounts, credit cards, or any banking service..."}
            className="flex-1 border-gray-300 focus:border-primary focus:ring-primary rounded-xl px-4 py-3 text-sm h-12"
            disabled={isTyping}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputText.trim() || isTyping}
            className="bg-primary hover:bg-primary/90 rounded-xl px-6 py-3 h-12 transition-all duration-200"
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