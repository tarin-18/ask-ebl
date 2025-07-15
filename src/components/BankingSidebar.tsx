import { useState, useEffect } from "react";
import { ChevronRight, DollarSign, CreditCard, TrendingUp, History, HelpCircle, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useProfile, useLoans, useTransactions } from "@/hooks/useBankingData";

interface BankingSidebarProps {
  onInfoClick: (type: string, data: any) => void;
  userLoginId: string | null;
  onAccountSwitch: (loginId: string) => void;
}

export function BankingSidebar({ onInfoClick, userLoginId, onAccountSwitch }: BankingSidebarProps) {
  const { data: profile, isLoading: profileLoading } = useProfile(userLoginId);
  const { data: loans, isLoading: loansLoading } = useLoans(userLoginId);
  const { data: transactions, isLoading: transactionsLoading } = useTransactions(userLoginId, 5);
  
  const [openSections, setOpenSections] = useState<string[]>(['balance']);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('login_id, full_name, account_number')
        .order('full_name');
      
      if (data && !error) {
        setAvailableUsers(data);
      }
    };

    fetchUsers();
  }, []);

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

  if (!userLoginId) {
    return (
      <div style={{ 
        width: '320px', 
        backgroundColor: '#ffffff', 
        borderRight: '1px solid #e5e7eb', 
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '16px'
        }}>
          Please login to your account
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div style={{ 
        width: '320px', 
        backgroundColor: '#ffffff', 
        borderRight: '1px solid #e5e7eb', 
        padding: '20px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ height: '80px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}></div>
          <div style={{ height: '64px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}></div>
          <div style={{ height: '64px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '320px', 
      backgroundColor: '#ffffff', 
      borderRight: '1px solid #e5e7eb', 
      overflowY: 'auto'
    }}>
      <div style={{ 
        padding: '20px', 
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '8px',
              transition: 'background-color 0.2s'
            }}
            className="hover:bg-muted"
            >
              <div style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: '#1a5f3f', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>
                  {profile?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  fontSize: '16px',
                  margin: '0 0 4px 0'
                }}>
                  {profile?.full_name || 'Demo User'}
                </h2>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#6b7280',
                  margin: '0'
                }}>
                  A/C: {profile?.account_number}
                </p>
              </div>
              <ChevronDown style={{ width: '16px', height: '16px', color: '#6b7280' }} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {availableUsers.map((account) => (
              <DropdownMenuItem
                key={account.id}
                onClick={() => onAccountSwitch(account.id)}
                className={userLoginId === account.id ? "bg-muted" : ""}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {account.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{account.name}</div>
                    <div className="text-sm text-muted-foreground">{account.accountNumber}</div>
                  </div>
                  {userLoginId === account.id && (
                    <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Account Balance */}
        <Card className="bg-warning/10 border-warning/20"
        style={{ 
          borderRadius: '8px'
        }}>
          <Collapsible 
            open={openSections.includes('balance')} 
            onOpenChange={() => toggleSection('balance')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader style={{ 
                cursor: 'pointer', 
                padding: '16px',
                borderBottom: openSections.includes('balance') ? '1px solid #e5e7eb' : 'none'
              }}>
                <CardTitle style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  fontSize: '16px',
                  margin: 0
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DollarSign style={{ width: '16px', height: '16px', color: '#10b981' }} />
                    My Balance
                  </div>
                  <ChevronRight style={{ 
                    width: '16px', 
                    height: '16px',
                    transform: openSections.includes('balance') ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent style={{ paddingTop: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Current A/C</span>
                  <span style={{ fontWeight: '600', color: '#10b981' }}>{formatCurrency(profile?.balance || 0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Savings A/C</span>
                  <span style={{ fontWeight: '600', color: '#10b981' }}>{formatCurrency(profile?.savings_balance || 0)}</span>
                </div>
                <Button 
                  onClick={() => onInfoClick('balance', profile)}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
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