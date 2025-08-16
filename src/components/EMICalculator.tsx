import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

const EMICalculator = () => {
  const [loanType, setLoanType] = useState('');
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [emi, setEmi] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  const loanTypes = [
    { value: 'personal', label: 'Personal Loan', rate: '12-16%' },
    { value: 'home', label: 'Home Loan', rate: '7.5-10%' },
    { value: 'car', label: 'Car Loan', rate: '10-14%' },
    { value: 'education', label: 'Education Loan', rate: '8-12%' },
  ];

  const calculateEMI = () => {
    const p = parseFloat(principal);
    const r = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const n = parseInt(tenure) * 12; // Total months

    if (p && r && n) {
      const emiAmount = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const total = emiAmount * n;
      const interest = total - p;
      
      setEmi(Math.round(emiAmount));
      setTotalAmount(Math.round(total));
      setTotalInterest(Math.round(interest));
    }
  };

  const handleLoanTypeChange = (value: string) => {
    setLoanType(value);
    const selectedLoan = loanTypes.find(loan => loan.value === value);
    if (selectedLoan) {
      // Set a default rate based on loan type
      const defaultRates: { [key: string]: string } = {
        personal: '14',
        home: '8.5',
        car: '12',
        education: '10'
      };
      setInterestRate(defaultRates[value] || '');
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto bg-primary/95 border-primary/80">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-primary-foreground text-lg">
          <Calculator className="h-4 w-4" />
          EMI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-primary-foreground">
        <div className="space-y-1">
          <Label htmlFor="loanType" className="text-xs text-primary-foreground">Loan Type</Label>
          <Select value={loanType} onValueChange={handleLoanTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select loan type" />
            </SelectTrigger>
            <SelectContent>
              {loanTypes.map((loan) => (
                <SelectItem key={loan.value} value={loan.value}>
                  {loan.label} ({loan.rate})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="principal" className="text-xs text-primary-foreground">Loan Amount (BDT)</Label>
          <Input
            id="principal"
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="Enter loan amount"
            className="h-8 text-xs bg-background/90"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="interestRate" className="text-xs text-primary-foreground">Interest Rate (% per annum)</Label>
          <Input
            id="interestRate"
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="Enter interest rate"
            className="h-8 text-xs bg-background/90"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="tenure" className="text-xs text-primary-foreground">Loan Tenure (Years)</Label>
          <Input
            id="tenure"
            type="number"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            placeholder="Enter tenure in years"
            className="h-8 text-xs bg-background/90"
          />
        </div>

        <Button onClick={calculateEMI} className="w-full h-8 text-xs bg-background hover:bg-background/90 text-primary">
          Calculate EMI
        </Button>

        {emi > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-accent/10 to-accent/20 rounded-lg border border-accent/30">
            <h3 className="font-semibold text-primary text-xs mb-2">EMI Calculation Results</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-foreground/80">Monthly EMI:</span>
                <span className="font-semibold text-primary">৳{emi.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/80">Total Amount:</span>
                <span className="font-semibold">৳{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/80">Total Interest:</span>
                <span className="font-semibold">৳{totalInterest.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EMICalculator;