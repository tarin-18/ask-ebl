import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Database, Plus, Settings } from "lucide-react";

export function UserManagementGuide() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary mb-2">User Management Guide</h1>
        <p className="text-muted-foreground">How to create and manage new users in the banking system</p>
      </div>

      <div className="grid gap-6">
        {/* Database Approach */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Method 1: Database Direct Insert
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Access Supabase SQL Editor</li>
                <li>Create new profile with unique UUID</li>
                <li>Add loan and transaction history</li>
                <li>Verify RLS policies are working</li>
              </ol>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2">Sample SQL:</h4>
              <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                <pre>{`INSERT INTO public.profiles (
  user_id, full_name, account_number, 
  balance, savings_balance
) VALUES (
  'new-uuid-here', 'User Name', '2001234572',
  150000.00, 75000.00
);`}</pre>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Badge variant="outline">Direct</Badge>
              <Badge variant="outline">Fast</Badge>
              <Badge variant="outline">Manual</Badge>
            </div>
          </CardContent>
        </Card>

        {/* API Approach */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-accent" />
              Method 2: Admin Interface (Future)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Features to Implement:</h4>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Admin dashboard for user creation</li>
                <li>Form-based user registration</li>
                <li>Automatic UUID generation</li>
                <li>Validation and error handling</li>
                <li>User role assignment</li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <Badge variant="secondary">User-Friendly</Badge>
              <Badge variant="secondary">Automated</Badge>
              <Badge variant="secondary">Secure</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Current Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-success" />
              Current Users in System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div>
                  <p className="font-medium">Demo User</p>
                  <p className="text-sm text-muted-foreground">12345678-1234-1234-1234-123456789012</p>
                </div>
                <Badge>Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div>
                  <p className="font-medium">Ahmed Rahman Khan</p>
                  <p className="text-sm text-muted-foreground">Account: 2001234567</p>
                </div>
                <Badge>Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div>
                  <p className="font-medium">Fatima Sultana</p>
                  <p className="text-sm text-muted-foreground">Account: 2001234568</p>
                </div>
                <Badge>Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div>
                  <p className="font-medium">Mohammad Ali Hasan</p>
                  <p className="text-sm text-muted-foreground">Account: 2001234569</p>
                </div>
                <Badge>Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div>
                  <p className="font-medium">Rashida Begum</p>
                  <p className="text-sm text-muted-foreground">Account: 2001234570</p>
                </div>
                <Badge>Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div>
                  <p className="font-medium">Karim Uddin Ahmed</p>
                  <p className="text-sm text-muted-foreground">Account: 2001234571</p>
                </div>
                <Badge>Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-warning" />
              Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                Always use proper UUID format for user_id
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                Ensure unique account numbers
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                Add meaningful transaction history
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                Test RLS policies after creation
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                Consider adding realistic loan data
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}