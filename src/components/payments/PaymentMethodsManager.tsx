
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, Trash2, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PaymentMethod {
  id: string;
  type: string;
  details: Record<string, any>;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
}

const PaymentMethodsManager = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: 'mobile_money',
    phone: '',
    provider: 'M-Pesa',
    account_name: '',
  });
  const { userData } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (userData.id) fetchMethods();
  }, [userData.id]);

  const fetchMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userData.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMethods((data as PaymentMethod[]) || []);
    } catch (err: any) {
      console.error('Error fetching payment methods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newMethod.phone && newMethod.type === 'mobile_money') {
      toast({ title: 'Phone number required', variant: 'destructive' });
      return;
    }
    if (!newMethod.account_name) {
      toast({ title: 'Account name required', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const isFirst = methods.length === 0;
      const details: Record<string, string> = {
        account_name: newMethod.account_name,
      };

      if (newMethod.type === 'mobile_money') {
        details.phone = newMethod.phone;
        details.provider = newMethod.provider;
      } else if (newMethod.type === 'paypal') {
        details.email = newMethod.phone; // reuse phone field for email
      } else {
        details.account_number = newMethod.phone;
      }

      const { error } = await supabase.from('payment_methods').insert({
        user_id: userData.id,
        type: newMethod.type,
        details,
        is_default: isFirst,
        is_active: true,
      });

      if (error) throw error;

      toast({ title: 'Payment method added' });
      setDialogOpen(false);
      setNewMethod({ type: 'mobile_money', phone: '', provider: 'M-Pesa', account_name: '' });
      fetchMethods();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // Unset all defaults
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userData.id);

      // Set new default
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Default payment method updated' });
      fetchMethods();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Payment method removed' });
      fetchMethods();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mobile_money': return 'Mobile Money';
      case 'paypal': return 'PayPal';
      case 'bank_transfer': return 'Bank Transfer';
      default: return type;
    }
  };

  const getDetailsSummary = (method: PaymentMethod) => {
    const d = method.details as Record<string, string>;
    if (method.type === 'mobile_money') return `${d.provider || 'Mobile'} - ${d.phone || ''}`;
    if (method.type === 'paypal') return `PayPal - ${d.email || ''}`;
    if (method.type === 'bank_transfer') return `Bank - ${d.account_number || ''}`;
    return d.account_name || 'Payment Method';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-12 bg-muted rounded"></div>
            <div className="h-12 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Payment Methods</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Method
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Type</Label>
                <Select value={newMethod.type} onValueChange={(v) => setNewMethod({ ...newMethod, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobile_money">Mobile Money</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Account Name</Label>
                <Input
                  value={newMethod.account_name}
                  onChange={(e) => setNewMethod({ ...newMethod, account_name: e.target.value })}
                  placeholder="Name on account"
                />
              </div>

              {newMethod.type === 'mobile_money' && (
                <>
                  <div>
                    <Label>Provider</Label>
                    <Select value={newMethod.provider} onValueChange={(v) => setNewMethod({ ...newMethod, provider: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                        <SelectItem value="Airtel Money">Airtel Money</SelectItem>
                        <SelectItem value="T-Kash">T-Kash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      value={newMethod.phone}
                      onChange={(e) => setNewMethod({ ...newMethod, phone: e.target.value })}
                      placeholder="+254..."
                    />
                  </div>
                </>
              )}

              {newMethod.type === 'paypal' && (
                <div>
                  <Label>PayPal Email</Label>
                  <Input
                    type="email"
                    value={newMethod.phone}
                    onChange={(e) => setNewMethod({ ...newMethod, phone: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
              )}

              {newMethod.type === 'bank_transfer' && (
                <div>
                  <Label>Account Number</Label>
                  <Input
                    value={newMethod.phone}
                    onChange={(e) => setNewMethod({ ...newMethod, phone: e.target.value })}
                    placeholder="Account number"
                  />
                </div>
              )}

              <Button onClick={handleAdd} disabled={saving} className="w-full">
                {saving ? 'Adding...' : 'Add Payment Method'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {methods.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No payment methods added yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add a payment method to receive payouts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {methods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{getTypeLabel(method.type)}</span>
                      {method.is_default && <Badge variant="secondary">Default</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{getDetailsSummary(method)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!method.is_default && (
                    <Button variant="ghost" size="sm" onClick={() => handleSetDefault(method.id)}>
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(method.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsManager;
