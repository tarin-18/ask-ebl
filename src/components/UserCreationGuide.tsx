import { useState } from "react";
import { Plus, User, FileText, CreditCard, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function UserCreationGuide() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const accountTypes = [
    {
      id: "savings",
      title: "Savings Account",
      description: "Perfect for personal savings and daily transactions",
      minBalance: "৳5,000",
      features: ["ATM Card", "Mobile Banking", "SMS Banking", "Checkbook"],
      benefits: ["3.5% annual interest", "Free account maintenance", "24/7 customer support"]
    },
    {
      id: "current",
      title: "Current Account",
      description: "Ideal for business and frequent transactions",
      minBalance: "৳10,000",
      features: ["ATM Card", "Overdraft Facility", "Business Banking", "Multiple Checkbooks"],
      benefits: ["No transaction limit", "Trade finance facility", "Dedicated relationship manager"]
    },
    {
      id: "student",
      title: "Student Account",
      description: "Special account for students with reduced requirements",
      minBalance: "৳1,000",
      features: ["ATM Card", "Mobile Banking", "SMS Banking", "Student Loan Facility"],
      benefits: ["Reduced charges", "Education loan eligibility", "Special student offers"]
    },
    {
      id: "premium",
      title: "Premium Account",
      description: "Elite banking experience with exclusive benefits",
      minBalance: "৳100,000",
      features: ["Priority Banking", "Investment Advisory", "Platinum Cards", "Airport Lounge Access"],
      benefits: ["Higher interest rates", "Fee waivers", "Premium customer service"]
    }
  ];

  const documents = [
    { icon: FileText, title: "Original NID/Passport", required: true },
    { icon: FileText, title: "2 copies of NID/Passport", required: true },
    { icon: User, title: "2 passport size photos", required: true },
    { icon: FileText, title: "Salary certificate/Business documents", required: true },
    { icon: CreditCard, title: "Initial deposit as per account type", required: true },
    { icon: FileText, title: "Nominee details and photo", required: false },
    { icon: Shield, title: "TIN certificate (for business accounts)", required: false }
  ];

  const steps = [
    {
      step: 1,
      title: "Choose Account Type",
      description: "Select the account type that best suits your needs",
      icon: User
    },
    {
      step: 2,
      title: "Prepare Documents",
      description: "Gather all required documents and photos",
      icon: FileText
    },
    {
      step: 3,
      title: "Visit Branch",
      description: "Visit any Eastern Bank branch with your documents",
      icon: CheckCircle
    },
    {
      step: 4,
      title: "Fill Application",
      description: "Complete the account opening form with our assistance",
      icon: FileText
    },
    {
      step: 5,
      title: "Initial Deposit",
      description: "Make the minimum required deposit for your account type",
      icon: CreditCard
    },
    {
      step: 6,
      title: "Activate Services",
      description: "Activate mobile banking, SMS alerts, and other services",
      icon: Shield
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          Create New User
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-brand">Account Opening Guide - Eastern Bank</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Account Types */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-brand">1. Choose Your Account Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accountTypes.map((account) => (
                <Card 
                  key={account.id} 
                  className={`cursor-pointer transition-all ${
                    selectedType === account.id ? 'ring-2 ring-brand bg-brand/5' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedType(account.id)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      {account.title}
                      <Badge variant="outline" className="text-success font-semibold">
                        Min: {account.minBalance}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{account.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Features:</h5>
                        <div className="flex flex-wrap gap-1">
                          {account.features.map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-2">Benefits:</h5>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {account.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-success" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Required Documents */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-brand">2. Required Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <doc.icon className={`w-5 h-5 ${doc.required ? 'text-brand' : 'text-muted-foreground'}`} />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{doc.title}</span>
                    <Badge 
                      variant={doc.required ? "default" : "secondary"} 
                      className="ml-2 text-xs"
                    >
                      {doc.required ? "Required" : "Optional"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Step by Step Process */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-brand">3. Account Opening Process</h3>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.step} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-brand text-brand-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-brand">{step.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  </div>
                  <step.icon className="w-5 h-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Additional Information */}
          <div className="bg-brand/5 p-4 rounded-lg">
            <h4 className="font-semibold text-brand mb-2">Additional Information</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Account opening process typically takes 30-45 minutes</li>
              <li>• Your debit card will be ready for collection in 3-5 working days</li>
              <li>• Mobile banking can be activated immediately after account opening</li>
              <li>• Checkbook will be available for collection in 2-3 working days</li>
              <li>• For faster service, visit during non-peak hours (11 AM - 3 PM)</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Need assistance? Call our customer service at <span className="font-semibold text-brand">16236</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Available 24/7 for all your banking needs
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}