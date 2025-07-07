import { useState } from "react";
import { ChevronRight, DollarSign, CreditCard, TrendingUp, History, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useProfile, useLoans, useTransactions } from "@/hooks/useBankingData";

interface BankingSidebarProps {
  onInfoClick: (type: string, data: any) => void;
}

export function BankingSidebar({ onInfoClick }: BankingSidebarProps) {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: loans, isLoading: loansLoading } = useLoans();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions(5);
  
  const [openSections, setOpenSections] = useState<string[]>(['balance']);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-BD');
  };

  if (profileLoading) {
    return (
      <div className="w-80 bg-sidebar border-r border-sidebar-border p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-16 bg-muted rounded"></div>
          <div className="h-16 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border overflow-y-auto">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">
              {profile?.full_name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-sidebar-foreground">{profile?.full_name || 'Demo User'}</h2>
            <p className="text-sm text-sidebar-foreground/70">A/C: {profile?.account_number}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Account Balance */}
        <Card>
          <Collapsible 
            open={openSections.includes('balance')} 
            onOpenChange={() => toggleSection('balance')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-success" />
                    My Balance
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${openSections.includes('balance') ? 'rotate-90' : ''}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current A/C</span>
                  <span className="font-semibold text-success">{formatCurrency(profile?.balance || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Savings A/C</span>
                  <span className="font-semibold text-success">{formatCurrency(profile?.savings_balance || 0)}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => onInfoClick('balance', profile)}
                >
                  View Details
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <Collapsible 
            open={openSections.includes('transactions')} 
            onOpenChange={() => toggleSection('transactions')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-info" />
                    Recent Transactions
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${openSections.includes('transactions') ? 'rotate-90' : ''}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-2">
                {transactionsLoading ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : (
                  <>
                    {transactions?.slice(0, 3).map((transaction) => (
                      <div key={transaction.id} className="flex justify-between items-center py-1">
                        <div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(transaction.transaction_date)}</p>
                        </div>
                        <span className={`text-sm font-semibold ${
                          transaction.amount > 0 ? 'text-success' : 'text-destructive'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2" 
                      onClick={() => onInfoClick('transactions', transactions)}
                    >
                      View All
                    </Button>
                  </>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* My Loans */}
        <Card>
          <Collapsible 
            open={openSections.includes('loans')} 
            onOpenChange={() => toggleSection('loans')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-warning" />
                    My Loans
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${openSections.includes('loans') ? 'rotate-90' : ''}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                {loansLoading ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : (
                  <>
                    {loans?.map((loan) => (
                      <div key={loan.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{loan.loan_type}</span>
                          <span className="text-xs bg-warning text-warning-foreground px-2 py-1 rounded">
                            {loan.interest_rate}% APR
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Remaining</span>
                            <span className="font-semibold text-warning">{formatCurrency(loan.remaining_amount)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Monthly Payment</span>
                            <span>{formatCurrency(loan.monthly_payment)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full" 
                      onClick={() => onInfoClick('loans', loans)}
                    >
                      Loan Details
                    </Button>
                  </>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Interest Rates */}
        <Card>
          <Collapsible 
            open={openSections.includes('rates')} 
            onOpenChange={() => toggleSection('rates')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-info" />
                    Interest Rates
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${openSections.includes('rates') ? 'rotate-90' : ''}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Savings A/C</span>
                  <span className="font-semibold text-success">3.5% p.a.</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fixed Deposit</span>
                  <span className="font-semibold text-success">5.5-7.5% p.a.</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Personal Loan</span>
                  <span className="font-semibold text-warning">9.5% p.a.</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2" 
                  onClick={() => onInfoClick('rates', {
                    savings: '3.5% per annum',
                    fixedDeposit: '5.5% to 7.5% per annum',
                    personalLoan: 'Starting from 9.5% per annum',
                    homeLoan: 'Starting from 9.0% per annum',
                    carLoan: 'Starting from 12.0% per annum'
                  })}
                >
                  View All Rates
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Help */}
        <Card>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center gap-2 text-base">
              <HelpCircle className="w-4 h-4 text-primary" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3">
              Use the chat to ask any banking questions!
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => onInfoClick('help', { message: 'How can I assist you today?' })}
            >
              Start Chat
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}