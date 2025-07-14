import { useState } from "react";
import { BankingSidebar } from "./BankingSidebar";
import { ChatBot } from "./ChatBot";
import { AuthLogin } from "./AuthLogin";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface InfoDialogData {
  type: string;
  data: any;
}

export function BankingDashboard() {
  const [infoDialog, setInfoDialog] = useState<InfoDialogData | null>(null);
  const [chatMessage, setChatMessage] = useState<string>('');
  const [userLoginId, setUserLoginId] = useState<string | null>(null);

  const handleInfoClick = (type: string, data: any) => {
    if (!userLoginId) {
      setChatMessage('Please login to your account to access banking information.');
      return;
    }
    
    if (type === 'help') {
      setChatMessage(data.message);
      return;
    }
    setInfoDialog({ type, data });
  };

  const handleLogin = (loginId: string) => {
    setUserLoginId(loginId);
    setChatMessage('Welcome! How can I assist you today?');
  };

  const handleLogout = () => {
    setUserLoginId(null);
    setInfoDialog(null);
    setChatMessage('');
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-BD');
  };

  const renderDialogContent = () => {
    if (!infoDialog) return null;

    const { type, data } = infoDialog;

    switch (type) {
      case 'balance':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Current Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">{formatCurrency(data?.balance || 0)}</div>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Savings Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">{formatCurrency(data?.savings_balance || 0)}</div>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                </CardContent>
              </Card>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Account Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Holder:</span>
                  <span>{data?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Number:</span>
                  <span>{data?.account_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Balance:</span>
                  <span className="font-semibold text-success">
                    {formatCurrency((data?.balance || 0) + (data?.savings_balance || 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {data?.map((transaction: any) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={transaction.amount > 0 ? "default" : "secondary"}>
                        {transaction.transaction_type}
                      </Badge>
                      <span className="font-medium">{transaction.description}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(transaction.transaction_date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${
                      transaction.amount > 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </div>
                    {transaction.balance_after && (
                      <p className="text-sm text-muted-foreground">
                        Balance: {formatCurrency(transaction.balance_after)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'loans':
        return (
          <div className="space-y-4">
            {data?.map((loan: any) => (
              <Card key={loan.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{loan.loan_type}</span>
                    <Badge variant="outline">{loan.interest_rate}% APR</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Loan:</span>
                      <div className="font-semibold">{formatCurrency(loan.total_amount)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Paid Amount:</span>
                      <div className="font-semibold text-success">{formatCurrency(loan.paid_amount)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Remaining:</span>
                      <div className="font-semibold text-warning">{formatCurrency(loan.remaining_amount)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Monthly Payment:</span>
                      <div className="font-semibold">{formatCurrency(loan.monthly_payment)}</div>
                    </div>
                  </div>
                  {loan.next_payment_date && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Next Payment Due:</span>
                      <div className="font-semibold text-warning">{formatDate(loan.next_payment_date)}</div>
                    </div>
                  )}
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Completion:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-background rounded-full h-2">
                          <div 
                            className="bg-success h-2 rounded-full" 
                            style={{ width: `${(loan.paid_amount / loan.total_amount) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold">
                          {Math.round((loan.paid_amount / loan.total_amount) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'rates':
        return (
          <div className="space-y-4">
            <div className="grid gap-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-success">Deposit Rates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Savings Account</span>
                    <span className="font-semibold">{data.savings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fixed Deposit</span>
                    <span className="font-semibold">{data.fixedDeposit}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-warning">Loan Rates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Personal Loan</span>
                    <span className="font-semibold">{data.personalLoan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Home Loan</span>
                    <span className="font-semibold">{data.homeLoan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Car Loan</span>
                    <span className="font-semibold">{data.carLoan}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="text-xs text-muted-foreground">
              * Rates are subject to change and may vary based on loan amount, tenure, and other factors.
            </div>
          </div>
        );

      default:
        return <div>Information not available</div>;
    }
  };

  if (!userLoginId) {
    return <AuthLogin onLogin={handleLogin} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#ffffff' }}>
      <BankingSidebar 
        onInfoClick={handleInfoClick} 
        userLoginId={userLoginId}
        onLogout={handleLogout}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid #e5e7eb', 
          backgroundColor: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              color: '#1a5f3f',
              margin: '0 0 4px 0'
            }}>
              AskEBL - Banking Assistant
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280',
              margin: '0'
            }}>
              Banking Dashboard
            </p>
          </div>
        </div>
        <ChatBot initialMessage={chatMessage} />
      </div>
      
      <Dialog open={!!infoDialog} onOpenChange={() => setInfoDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="capitalize">
              {infoDialog?.type === 'rates' ? 'Interest Rates' : 
               infoDialog?.type === 'transactions' ? 'Transaction History' :
               infoDialog?.type === 'loans' ? 'Loan Information' :
               infoDialog?.type === 'balance' ? 'Account Balance' :
               infoDialog?.type || 'Information'}
            </DialogTitle>
          </DialogHeader>
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
}