import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, DollarSign } from 'lucide-react';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');

  // Mock exchange rates (in a real app, you'd fetch from an API)
  const exchangeRates: { [key: string]: { rate: number; name: string; flag: string } } = {
    USD: { rate: 110.0, name: 'US Dollar', flag: '🇺🇸' },
    EUR: { rate: 120.5, name: 'Euro', flag: '🇪🇺' },
    GBP: { rate: 140.2, name: 'British Pound', flag: '🇬🇧' },
    JPY: { rate: 0.75, name: 'Japanese Yen', flag: '🇯🇵' },
    AUD: { rate: 72.8, name: 'Australian Dollar', flag: '🇦🇺' },
    CAD: { rate: 81.5, name: 'Canadian Dollar', flag: '🇨🇦' },
    CHF: { rate: 122.3, name: 'Swiss Franc', flag: '🇨🇭' },
    CNY: { rate: 15.2, name: 'Chinese Yuan', flag: '🇨🇳' },
    INR: { rate: 1.32, name: 'Indian Rupee', flag: '🇮🇳' },
    SGD: { rate: 81.7, name: 'Singapore Dollar', flag: '🇸🇬' },
    MYR: { rate: 24.8, name: 'Malaysian Ringgit', flag: '🇲🇾' },
    THB: { rate: 3.1, name: 'Thai Baht', flag: '🇹🇭' },
    SAR: { rate: 29.3, name: 'Saudi Riyal', flag: '🇸🇦' },
    AED: { rate: 30.0, name: 'UAE Dirham', flag: '🇦🇪' },
    PKR: { rate: 0.39, name: 'Pakistani Rupee', flag: '🇵🇰' },
  };

  useEffect(() => {
    const now = new Date();
    setLastUpdated(now.toLocaleString());
  }, []);

  const convertCurrency = () => {
    const inputAmount = parseFloat(amount);
    if (inputAmount && exchangeRates[fromCurrency]) {
      const converted = inputAmount * exchangeRates[fromCurrency].rate;
      setConvertedAmount(Math.round(converted * 100) / 100);
    }
  };

  const swapCurrency = () => {
    // This would swap from->to in a full converter, but since we only convert TO BDT, we'll just recalculate
    convertCurrency();
  };

  return (
    <Card className="w-full max-w-xs mx-auto bg-slate-50 border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-1 text-blue-800 text-sm">
          <DollarSign className="h-3 w-3" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="amount" className="text-xs text-blue-700">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="h-7 text-xs"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="fromCurrency" className="text-xs text-blue-700">From Currency</Label>
          <Select value={fromCurrency} onValueChange={setFromCurrency}>
            <SelectTrigger className="h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(exchangeRates).map(([code, { name, flag }]) => (
                <SelectItem key={code} value={code} className="text-xs">
                  {flag} {code} - {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-blue-700">To Currency</Label>
          <div className="p-1.5 bg-blue-100 rounded-md text-xs text-blue-800">
            🇧🇩 BDT - Bangladeshi Taka
          </div>
        </div>

        <Button onClick={convertCurrency} className="w-full h-7 bg-blue-700 hover:bg-blue-800 text-xs">
          Convert to BDT
        </Button>

        {convertedAmount > 0 && (
          <div className="mt-2 p-2 bg-yellow-100 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-blue-800 mb-1 text-xs">Result</h3>
            <div className="space-y-0.5">
              <div className="text-center">
                <div className="text-xs font-semibold text-blue-800">
                  {exchangeRates[fromCurrency].flag} {amount} {fromCurrency}
                </div>
                <div className="text-xs text-blue-600 my-0.5">=</div>
                <div className="text-sm font-bold text-blue-800">
                  🇧🇩 ৳{convertedAmount.toLocaleString()}
                </div>
              </div>
              <div className="text-center text-xs text-blue-600 mt-1">
                Rate: 1 {fromCurrency} = ৳{exchangeRates[fromCurrency].rate}
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-blue-600 text-center">
          <p>* Indicative rates only</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;