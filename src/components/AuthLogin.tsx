import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn } from "lucide-react";

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

    // Simple demo validation - in real app this would be server-side
    // Demo user IDs: 12345, 67890, 11111, 22222, 33333
    const validUsers = ["12345", "67890", "11111", "22222", "33333", "55555"];
    const demoPassword = "demo123";

    if (validUsers.includes(userId) && password === demoPassword) {
      onLogin(userId);
    } else {
      setError("Invalid user ID or password");
    }

    setIsLoading(false);
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
            Eastern Bank PLC Banking Assistant
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

          <div style={{ 
            marginTop: '20px', 
            padding: '12px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '6px' 
          }}>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: '500' }}>
              Demo Credentials:
            </p>
            <p style={{ fontSize: '12px', color: '#374151' }}>
              User ID: 12345, 67890, 11111, 22222, 33333 or 55555<br/>
              Password: demo123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}