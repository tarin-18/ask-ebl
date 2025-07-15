import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AuthLoginProps {
  onLogin: (userId: string) => void;
}

export function AuthLogin({ onLogin }: AuthLoginProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate 5-digit user ID
    if (!/^\d{5}$/.test(userId)) {
      setError("User ID must be exactly 5 digits");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Password is required");
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting login with:', { userId, password });
      
      // Query the database for user authentication
      const { data: user, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('login_id', userId)
        .eq('password', password)
        .maybeSingle();

      console.log('Database response:', { user, error });

      if (error) {
        console.error('Database error:', error);
        setError(`Database error: ${error.message}`);
        setIsLoading(false);
        return;
      }

      if (!user) {
        setError("Invalid user ID or password");
        setIsLoading(false);
        return;
      }

      console.log('Login successful for user:', user);
      onLogin(userId);
    } catch (err) {
      console.error('Login exception:', err);
      setError("Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      padding: '20px'
    }}>
      <Card style={{ width: '400px', maxWidth: '100%' }}>
        <CardHeader style={{ textAlign: 'center' }}>
          <CardTitle style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px',
            color: '#06014b',
            fontSize: '24px',
            marginBottom: '8px'
          }}>
            <LogIn style={{ width: '24px', height: '24px' }} />
            Login to AskEBL
          </CardTitle>
          <p style={{ color: '#06014b', fontSize: '14px' }}>
            Banking Assistant
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                marginBottom: '4px',
                color: '#374151'
              }}>
                User ID (5 digits)
              </label>
              <Input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your 5-digit user ID"
                maxLength={5}
                style={{
                  padding: '8px 12px',
                  fontSize: '16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  width: '100%'
                }}
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                marginBottom: '4px',
                color: '#374151'
              }}>
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  padding: '8px 12px',
                  fontSize: '16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  width: '100%'
                }}
              />
            </div>

            {error && (
              <Alert style={{ 
                padding: '12px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px'
              }}>
                <AlertDescription style={{ color: '#dc2626', fontSize: '14px' }}>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#1a5f3f',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
}