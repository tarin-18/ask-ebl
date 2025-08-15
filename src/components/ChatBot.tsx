import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Trash2, Info, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  isLoanSelection?: boolean; // For loan type selection
  loanOptions?: string[]; // Available loan options
  showFeedback?: boolean; // For showing feedback emojis
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
  const [awaitingLoanSelection, setAwaitingLoanSelection] = useState(false);
  const [awaitingLocationForATM, setAwaitingLocationForATM] = useState(false);
  const [awaitingLocationForBranch, setAwaitingLocationForBranch] = useState(false);
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

  const loanTypes = [
    "Personal Loan",
    "Home Loan",
    "Car Loan",
    "Education Loan",
    "Business Loan",
    "Islamic Financing"
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

  const loanInfo = {
    "Personal Loan": "EBL Personal Loan offers quick cash for your personal needs with competitive interest rates and flexible repayment terms up to 5 years. Features include minimal documentation, quick approval within 48 hours, and loan amounts up to BDT 25 lakhs. No collateral required for salaried individuals.",
    "Home Loan": "EBL Home Loan helps you buy your dream home with attractive interest rates and long-term repayment options up to 20 years. Features include up to 80% financing of property value, step-up EMI options, and free property valuation. Special rates for government employees and women borrowers.",
    "Car Loan": "EBL Car Loan offers easy financing for new and reconditioned cars with competitive rates and quick processing. Features include up to 85% financing, flexible tenure up to 5 years, and comprehensive insurance coverage. Special partnerships with leading car dealers for better rates.",
    "Education Loan": "EBL Education Loan supports your educational dreams with affordable financing for higher studies locally and abroad. Features include competitive interest rates, flexible repayment starting after course completion, and coverage for tuition fees, living expenses, and other educational costs.",
    "Business Loan": "EBL Business Loan provides working capital and term loans for business growth with customized solutions. Features include flexible repayment terms, competitive rates based on business profile, and dedicated relationship manager support. Both secured and unsecured options available.",
    "Islamic Financing": "EBL Islamic Financing offers Shariah-compliant financing solutions based on Islamic principles. Features include profit-sharing arrangements, asset-backed financing, and compliance with Islamic financial guidelines. Available for personal, business, and property financing needs."
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

  const isLoanQuery = (userInput: string) => {
    const input = userInput.toLowerCase();
    const loanKeywords = ['loan', 'loans', 'personal loan', 'home loan', 'car loan', 'education loan', 'business loan', 'islamic financing', 'financing'];
    return loanKeywords.some(keyword => input.includes(keyword));
  };

  const isATMQuery = (userInput: string) => {
    const input = userInput.toLowerCase();
    const atmKeywords = ['atm', 'atm booth', 'atm machine', 'cash machine', 'nearby atm', 'atm location'];
    return atmKeywords.some(keyword => input.includes(keyword));
  };

  const isBranchQuery = (userInput: string) => {
    const input = userInput.toLowerCase();
    const branchKeywords = ['branch', 'branches', 'nearby branch', 'bank branch', 'branch location', 'office'];
    return branchKeywords.some(keyword => input.includes(keyword));
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

    // Check if this is a loan-related query
    if (isLoanQuery(userInput)) {
      return 'LOAN_QUERY';
    }

    // Check if this is an ATM-related query
    if (isATMQuery(userInput)) {
      return 'ATM_QUERY';
    }

    // Check if this is a branch-related query
    if (isBranchQuery(userInput)) {
      return 'BRANCH_QUERY';
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
          timestamp: new Date(),
          showFeedback: true
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
          timestamp: new Date(),
          showFeedback: true
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

    // Check if this is a loan selection response
    if (awaitingLoanSelection) {
      const selectedLoan = loanTypes.find(loan => 
        loan.toLowerCase() === currentInput.toLowerCase() ||
        currentInput.toLowerCase().includes(loan.toLowerCase())
      );

      if (selectedLoan) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: loanInfo[selectedLoan as keyof typeof loanInfo],
          sender: 'bot',
          timestamp: new Date(),
          showFeedback: true
        };

        setTimeout(() => {
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
          setAwaitingLoanSelection(false);
        }, 1000);
      } else {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Please select one of the loan types I mentioned: Personal Loan, Home Loan, Car Loan, Education Loan, Business Loan, or Islamic Financing.",
          sender: 'bot',
          timestamp: new Date(),
          isLoanSelection: true,
          loanOptions: loanTypes
        };

        setTimeout(() => {
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
        }, 1000);
      }
      return;
    }

    // Check if this is a location response for ATM
    if (awaitingLocationForATM) {
      const location = currentInput.trim();
      const atmBranches = getATMsByLocation(location);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: atmBranches,
        sender: 'bot',
        timestamp: new Date(),
        showFeedback: true
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        setAwaitingLocationForATM(false);
      }, 1000);
      return;
    }

    // Check if this is a location response for Branch
    if (awaitingLocationForBranch) {
      const location = currentInput.trim();
      const branches = getBranchesByLocation(location);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: branches,
        sender: 'bot',
        timestamp: new Date(),
        showFeedback: true
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        setAwaitingLocationForBranch(false);
      }, 1000);
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
            title: "Suggestion Submitted",
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
      const input = currentInput.toLowerCase();
      
      // Check for lost card query
      if (input.includes('lost card') || input.includes('card lost') || input.includes('report card') || input.includes('card stolen')) {
        const lostCardBotMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Here's what you need to do immediately if you've lost your card:\n\n🚨 **Immediate Actions:**\n1. **Block your card immediately** by calling EBL 24/7 hotline: 16421 or +88-02-8836010\n2. **Visit the nearest EBL branch** with your NID and account details\n3. **File a written application** for card replacement\n\n📋 **Required Documents:**\n• Original National ID Card\n• Account opening form copy\n• 2 recent passport-size photographs\n• Police report (if card was stolen)\n\n💳 **Card Replacement Process:**\n• New card will be issued within 7-10 working days\n• Replacement fee: BDT 500 for debit card, BDT 1000 for credit card\n• You can request emergency cash if needed\n\n⚠️ **Important:** Monitor your account for unauthorized transactions and report them immediately. EBL provides zero liability protection for fraudulent transactions reported within 24 hours.",
          sender: 'bot',
          timestamp: new Date(),
          showFeedback: true
        };

        setTimeout(() => {
          setMessages(prev => [...prev, lostCardBotMessage]);
          setIsTyping(false);
        }, 1000);
        return;
      }
      
      const bestMatch = findBestMatch(currentInput);
      
      let botResponse = '';
      let isCard = false;
      let isAccount = false;
      let isLoan = false;
      let isATM = false;
      let isBranch = false;
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
      } else if (bestMatch === 'LOAN_QUERY') {
        botResponse = "I'd be happy to help you with information about our loans! Please select which type of loan you'd like to know about:";
        isLoan = true;
        setAwaitingLoanSelection(true);
        setAwaitingSuggestion(null);
      } else if (bestMatch === 'ATM_QUERY') {
        botResponse = "I can help you find nearby EBL ATM booths! Could you please tell me your current location or the area you're looking for?";
        isATM = true;
        setAwaitingLocationForATM(true);
        setAwaitingSuggestion(null);
      } else if (bestMatch === 'BRANCH_QUERY') {
        botResponse = "I can help you find nearby EBL branches! Could you please tell me your current location or the area you're looking for?";
        isBranch = true;
        setAwaitingLocationForBranch(true);
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
        isQuestion: !bestMatch && !isCard && !isAccount && !isLoan,
        originalQuestion: !bestMatch && !isCard && !isAccount && !isLoan ? currentInput : undefined,
        isCardSelection: isCard,
        cardOptions: isCard ? cardTypes : undefined,
        isAccountSelection: isAccount,
        accountOptions: isAccount ? accountTypes : undefined,
        isLoanSelection: isLoan,
        loanOptions: isLoan ? loanTypes : undefined,
        showFeedback: bestMatch && !isCard && !isAccount && !isLoan && !isATM && !isBranch
      };

      if (isCard) {
        setAwaitingCardSelection(true);
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: (Date.now() + 2).toString(),
            text: botResponse,
            sender: 'bot',
            timestamp: new Date(),
            isCardSelection: true,
            cardOptions: cardTypes
          }]);
          setIsTyping(false);
        }, 1000);
      } else if (isAccount) {
        setAwaitingAccountSelection(true);
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: (Date.now() + 2).toString(),
            text: botResponse,
            sender: 'bot',
            timestamp: new Date(),
            isAccountSelection: true,
            accountOptions: accountTypes
          }]);
          setIsTyping(false);
        }, 1000);
      } else if (isLoan) {
        setAwaitingLoanSelection(true);
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: (Date.now() + 2).toString(),
            text: botResponse,
            sender: 'bot',
            timestamp: new Date(),
            isLoanSelection: true,
            loanOptions: loanTypes
          }]);
          setIsTyping(false);
        }, 1000);
      } else {
        setTimeout(() => {
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
        }, 1000);
      }
    }, 1000);
  };

  const getATMsByLocation = (location: string) => {
    const locationLower = location.toLowerCase();

    // Pre-defined ATM data for major areas
    const atmData: { [key: string]: string[] } = {
      'dhaka': [
        'EBL ATM - Gulshan 1 Circle, Dhaka-1212 | 24/7 Service',
        'EBL ATM - Dhanmondi 27, Dhaka-1205 | 24/7 Service',
        'EBL ATM - Motijheel Commercial Area, Dhaka-1000 | 24/7 Service',
        'EBL ATM - Uttara Sector 7, Dhaka-1230 | 24/7 Service',
        'EBL ATM - Wari, Dhaka-1203 | 24/7 Service'
      ],
      'chittagong': [
        'EBL ATM - Agrabad Commercial Area, Chittagong | 24/7 Service',
        'EBL ATM - Nasirabad, Chittagong | 24/7 Service',
        'EBL ATM - Station Road, Chittagong | 24/7 Service'
      ],
      'sylhet': [
        'EBL ATM - Zindabazar, Sylhet | 24/7 Service',
        'EBL ATM - Amberkhana, Sylhet | 24/7 Service'
      ]
    };

    // Check for specific areas
    for (const [area, atms] of Object.entries(atmData)) {
      if (locationLower.includes(area)) {
        return `Here are the nearby EBL ATM booths in ${area.charAt(0).toUpperCase() + area.slice(1)}:\n\n${atms.map((atm, index) => `${index + 1}. ${atm}`).join('\n\n')}\n\nAll ATMs provide 24/7 cash withdrawal, balance inquiry, and mini statements. Daily withdrawal limit: BDT 40,000.`;
      }
    }

    return `Here are EBL ATM booths near your location:\n\n1. EBL ATM - ${location} Main Branch | 24/7 Service\n2. EBL ATM - ${location} Commercial Area | 24/7 Service\n3. EBL ATM - ${location} Shopping Center | 24/7 Service\n\nAll ATMs provide 24/7 cash withdrawal, balance inquiry, and mini statements. For exact locations, please call 16227.`;
  };

  const getBranchesByLocation = (location: string) => {
    const locationLower = location.toLowerCase();

    // Pre-defined branch data for major areas
    const branchData: { [key: string]: string[] } = {
      'dhaka': [
        'Gulshan Branch - 100 Gulshan Avenue, Dhaka-1212 | Phone: +880-2-8830721',
        'Dhanmondi Branch - 32 Dhanmondi, Dhaka-1205 | Phone: +880-2-9661301',
        'Motijheel Branch - 56 Motijheel, Dhaka-1000 | Phone: +880-2-9560387',
        'Uttara Branch - House 45, Road 12, Sector 7, Uttara, Dhaka-1230 | Phone: +880-2-8958742'
      ],
      'chittagong': [
        'Agrabad Branch - 1420 Sheikh Mujib Road, Agrabad, Chittagong | Phone: +880-31-710501',
        'Nasirabad Branch - 786 CDA Avenue, Nasirabad, Chittagong | Phone: +880-31-624578',
        'Station Road Branch - 123 Station Road, Chittagong | Phone: +880-31-635241'
      ],
      'sylhet': [
        'Zindabazar Branch - 45 Zindabazar, Sylhet | Phone: +880-821-725687',
        'Amberkhana Branch - 789 Amberkhana, Sylhet | Phone: +880-821-714523'
      ]
    };

    // Check for specific areas
    for (const [area, branches] of Object.entries(branchData)) {
      if (locationLower.includes(area)) {
        return `Here are the nearby EBL branches in ${area.charAt(0).toUpperCase() + area.slice(1)}:\n\n${branches.map((branch, index) => `${index + 1}. ${branch}`).join('\n\n')}\n\nBranch Hours: Sunday to Thursday 9:00 AM - 5:00 PM\nFriday: 9:00 AM - 12:00 PM\nSaturday: Closed`;
      }
    }

    return `Here are EBL branches near your location:\n\n1. EBL ${location} Branch - Main Road, ${location} | Phone: 16227\n2. EBL ${location} Commercial Branch - Commercial Area, ${location} | Phone: 16227\n\nBranch Hours: Sunday to Thursday 9:00 AM - 5:00 PM\nFriday: 9:00 AM - 12:00 PM\nSaturday: Closed\n\nFor exact addresses and directions, please call 16227.`;
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
    if (awaitingLoanSelection) {
      setAwaitingLoanSelection(false); // Clear any pending loan selection
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

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Hello! I\'m AskEBL, your banking assistant. How can I help you today?',
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    setAwaitingSuggestion(null);
    setAwaitingCardSelection(false);
    setAwaitingAccountSelection(false);
    setAwaitingLoanSelection(false);
    setAwaitingLocationForATM(false);
    setAwaitingLocationForBranch(false);
  };

  const handleFeedback = (messageId: string, isPositive: boolean) => {
    toast({
      title: "Thank you for your feedback!",
      description: isPositive ? "Glad I could help!" : "We'll work on improving our responses.",
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-white p-6 flex items-center gap-4">
        <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20">
          <img 
            src="/lovable-uploads/3130d7ff-26da-43e5-b8dd-c0585dfa7839.png" 
            alt="EBL Chat Assistant" 
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">AskEBL - Your Banking Assistant</h1>
          <p className="text-primary-foreground/80">Get instant help with all your banking needs</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>EBL Contact Information</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Contact Us</h4>
                  <p>📞 Hotline: 16421</p>
                  <p>📞 International: +88-02-8836010</p>
                  <p>📧 Email: info@ebl.com.bd</p>
                  <p>🌐 Website: www.ebl.com.bd</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Customer Support Hours</h4>
                  <p>🕒 24/7 Emergency Support</p>
                  <p>🕘 Branch Hours: 9:00 AM - 5:00 PM (Sunday-Thursday)</p>
                  <p>🕘 Call Center: 9:00 AM - 9:00 PM (Sunday-Thursday)</p>
                  <p>📅 Friday: 9:00 AM - 12:00 PM & 2:00 PM - 5:00 PM</p>
                  <p>📅 Saturday: Closed</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="sm" onClick={clearChat} className="text-white hover:bg-white/10">
            <Trash2 className="h-4 w-4" />
          </Button>
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
                {message.isLoanSelection && awaitingLoanSelection && message.loanOptions && (
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {message.loanOptions.map((loanType) => (
                      <Button 
                        key={loanType}
                        size="sm" 
                        onClick={() => {
                          setInputText(loanType);
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 text-xs justify-start"
                      >
                        {loanType}
                      </Button>
                    ))}
                  </div>
                )}
                <div className={`flex items-center justify-between text-xs mt-2 ${
                  message.sender === 'user' ? 'text-primary-foreground/70' : 'text-gray-500'
                }`}>
                  <span>
                    {message.timestamp.toLocaleTimeString('en-BD', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  {message.sender === 'bot' && message.showFeedback && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Was this helpful?</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-green-100"
                        onClick={() => handleFeedback(message.id, true)}
                      >
                        <ThumbsUp className="h-3 w-3 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-red-100"
                        onClick={() => handleFeedback(message.id, false)}
                      >
                        <ThumbsDown className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  )}
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