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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-ebl-blue">
          <DollarSign className="h-5 w-5" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fromCurrency">From Currency</Label>
          <Select value={fromCurrency} onValueChange={setFromCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(exchangeRates).map(([code, { name, flag }]) => (
                <SelectItem key={code} value={code}>
                  {flag} {code} - {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={swapCurrency}
            className="p-2"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label>To Currency</Label>
          <div className="p-3 bg-muted rounded-md">
            🇧🇩 BDT - Bangladeshi Taka
          </div>
        </div>

        <Button onClick={convertCurrency} className="w-full bg-ebl-blue hover:bg-ebl-blue/90">
          Convert to BDT
        </Button>

        {convertedAmount > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-ebl-blue/5 to-ebl-yellow/5 rounded-lg border">
            <h3 className="font-semibold text-ebl-blue mb-3">Conversion Result</h3>
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {exchangeRates[fromCurrency].flag} {amount} {fromCurrency}
                </div>
                <div className="text-sm text-muted-foreground my-1">=</div>
                <div className="text-2xl font-bold text-ebl-blue">
                  🇧🇩 ৳{convertedAmount.toLocaleString()}
                </div>
              </div>
              <div className="text-center text-xs text-muted-foreground mt-3">
                Rate: 1 {fromCurrency} = ৳{exchangeRates[fromCurrency].rate}
              </div>
              <div className="text-center text-xs text-muted-foreground">
                Last updated: {lastUpdated}
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          <p>* Exchange rates are indicative and may vary from actual market rates.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;