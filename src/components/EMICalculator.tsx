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
    <Card className="w-full max-w-xs mx-auto bg-slate-50 border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-1 text-blue-800 text-sm">
          <Calculator className="h-3 w-3" />
          EMI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="loanType" className="text-xs text-blue-700">Loan Type</Label>
          <Select value={loanType} onValueChange={handleLoanTypeChange}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select loan type" />
            </SelectTrigger>
            <SelectContent>
              {loanTypes.map((loan) => (
                <SelectItem key={loan.value} value={loan.value} className="text-xs">
                  {loan.label} ({loan.rate})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="principal" className="text-xs text-blue-700">Loan Amount (BDT)</Label>
          <Input
            id="principal"
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="Enter amount"
            className="h-7 text-xs"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="interestRate" className="text-xs text-blue-700">Interest Rate (%)</Label>
          <Input
            id="interestRate"
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="Enter rate"
            className="h-7 text-xs"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="tenure" className="text-xs text-blue-700">Tenure (Years)</Label>
          <Input
            id="tenure"
            type="number"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            placeholder="Enter years"
            className="h-7 text-xs"
          />
        </div>

        <Button onClick={calculateEMI} className="w-full h-7 bg-blue-700 hover:bg-blue-800 text-xs">
          Calculate EMI
        </Button>

        {emi > 0 && (
          <div className="mt-2 p-2 bg-yellow-100 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-blue-800 mb-1 text-xs">Results</h3>
            <div className="space-y-0.5 text-xs">
              <div className="flex justify-between">
                <span className="text-blue-700">Monthly EMI:</span>
                <span className="font-semibold text-blue-800">৳{emi.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Total Amount:</span>
                <span className="font-semibold text-blue-800">৳{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Total Interest:</span>
                <span className="font-semibold text-blue-800">৳{totalInterest.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EMICalculator;