
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  commission: number;
}

const plans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    period: 'month',
    description: 'Perfect for getting started',
    features: [
      'Up to 5 shipments per month',
      'Basic tracking',
      'Email support',
      'Standard delivery options'
    ],
    icon: <Star className="h-5 w-5" />,
    commission: 15
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 2999,
    period: 'month',
    description: 'Best for growing businesses',
    features: [
      'Unlimited shipments',
      'Real-time tracking',
      'Priority support',
      'Advanced analytics',
      'Custom delivery options',
      'API access'
    ],
    popular: true,
    icon: <Zap className="h-5 w-5" />,
    commission: 10
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 9999,
    period: 'month',
    description: 'For large scale operations',
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'Advanced reporting',
      'White-label options'
    ],
    icon: <Crown className="h-5 w-5" />,
    commission: 5
  }
];

interface PricingPlansProps {
  onSelectPlan: (planId: string) => void;
  currentPlan?: string;
}

const PricingPlans = ({ onSelectPlan, currentPlan }: PricingPlansProps) => {
  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Scale your delivery business with our flexible pricing plans. 
          Lower commissions as you grow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                {plan.icon}
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  {plan.price === 0 ? 'Free' : `KSh ${plan.price.toLocaleString()}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-gray-500">/{plan.period}</span>
                )}
              </div>
              <p className="text-gray-600 mt-2">{plan.description}</p>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  {plan.commission}% commission on deliveries
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full" 
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => onSelectPlan(plan.id)}
                disabled={currentPlan === plan.id}
              >
                {currentPlan === plan.id ? 'Current Plan' : 'Choose Plan'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          All plans include secure payments, customer support, and regular updates.
          Upgrade or downgrade anytime.
        </p>
      </div>
    </div>
  );
};

export default PricingPlans;
