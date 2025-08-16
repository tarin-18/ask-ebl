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
    <Card className="w-full max-w-sm mx-auto bg-primary/95 border-primary/80">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-primary-foreground text-lg">
          <DollarSign className="h-4 w-4" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-primary-foreground">
        <div className="space-y-1">
          <Label htmlFor="amount" className="text-xs text-primary-foreground">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="h-8 text-xs bg-background/90"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="fromCurrency" className="text-xs text-primary-foreground">From Currency</Label>
          <Select value={fromCurrency} onValueChange={setFromCurrency}>
            <SelectTrigger className="h-8 text-xs bg-background/90">
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

        <div className="flex items-center justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={swapCurrency}
            className="p-1 h-6 w-6 bg-background/90 hover:bg-background text-primary"
          >
            <ArrowUpDown className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-primary-foreground">To Currency</Label>
          <div className="p-2 bg-background/90 rounded-md text-xs text-foreground">
            🇧🇩 BDT - Bangladeshi Taka
          </div>
        </div>

        <Button onClick={convertCurrency} className="w-full h-8 text-xs bg-background hover:bg-background/90 text-primary">
          Convert to BDT
        </Button>

        {convertedAmount > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-accent/10 to-accent/20 rounded-lg border border-accent/30">
            <h3 className="font-semibold text-primary text-xs mb-2">Conversion Result</h3>
            <div className="space-y-1">
              <div className="text-center">
                <div className="text-xs font-semibold text-foreground">
                  {exchangeRates[fromCurrency].flag} {amount} {fromCurrency}
                </div>
                <div className="text-xs text-muted-foreground">=</div>
                <div className="text-sm font-bold text-primary">
                  🇧🇩 ৳{convertedAmount.toLocaleString()}
                </div>
              </div>
              <div className="text-center text-xs text-muted-foreground mt-2">
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