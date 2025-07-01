
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download, Send } from 'lucide-react';

const InvoiceGenerator = () => {
  const [invoice, setInvoice] = useState({
    amount: '',
    description: '',
    dueDate: '',
    clientEmail: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateInvoice = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          total_amount: parseFloat(invoice.amount),
          due_date: invoice.dueDate,
          status: 'draft',
          invoice_number: `INV-${Date.now()}`
        })
        .select()
        .single();

      if (error) throw error;

      // Add invoice items
      await supabase
        .from('invoice_items')
        .insert({
          invoice_id: data.id,
          description: invoice.description,
          unit_price: parseFloat(invoice.amount),
          total_price: parseFloat(invoice.amount),
          quantity: 1
        });

      toast({
        title: "Invoice Generated",
        description: "Invoice has been created successfully"
      });

      setInvoice({ amount: '', description: '', dueDate: '', clientEmail: '' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Generate Invoice
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Amount ($)</label>
            <Input
              type="number"
              value={invoice.amount}
              onChange={(e) => setInvoice({ ...invoice, amount: e.target.value })}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Due Date</label>
            <Input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Client Email</label>
          <Input
            type="email"
            value={invoice.clientEmail}
            onChange={(e) => setInvoice({ ...invoice, clientEmail: e.target.value })}
            placeholder="client@example.com"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={invoice.description}
            onChange={(e) => setInvoice({ ...invoice, description: e.target.value })}
            placeholder="Service description..."
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={generateInvoice} disabled={loading} className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline">
            <Send className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceGenerator;
