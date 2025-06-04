
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface TransactionStats {
  totalEarnings: number;
  availableBalance: number;
  pendingPayouts: number;
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  transactions: any[];
}

export const useTransactionData = () => {
  const { userData, authenticated } = useAuth();
  const [stats, setStats] = useState<TransactionStats>({
    totalEarnings: 0,
    availableBalance: 0,
    pendingPayouts: 0,
    todayEarnings: 0,
    weeklyEarnings: 0,
    monthlyEarnings: 0,
    transactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authenticated && userData.id) {
      fetchTransactionData();
    }
  }, [authenticated, userData.id]);

  const fetchTransactionData = async () => {
    try {
      setLoading(true);

      // Fetch user transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;

      // Fetch referral payouts
      const { data: payouts, error: payoutsError } = await supabase
        .from('referral_payouts')
        .select('*')
        .eq('referrer_id', userData.id);

      if (payoutsError) throw payoutsError;

      // Calculate statistics
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

      const completedTransactions = transactions?.filter(t => t.status === 'completed') || [];
      
      const totalEarnings = completedTransactions.reduce((sum, t) => sum + t.net_amount, 0);
      const todayEarnings = completedTransactions
        .filter(t => new Date(t.created_at) >= today)
        .reduce((sum, t) => sum + t.net_amount, 0);
      const weeklyEarnings = completedTransactions
        .filter(t => new Date(t.created_at) >= weekAgo)
        .reduce((sum, t) => sum + t.net_amount, 0);
      const monthlyEarnings = completedTransactions
        .filter(t => new Date(t.created_at) >= monthAgo)
        .reduce((sum, t) => sum + t.net_amount, 0);

      const referralEarnings = payouts?.filter(p => p.status === 'success')
        .reduce((sum, p) => sum + p.amount, 0) || 0;
      
      const pendingPayouts = payouts?.filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0) || 0;

      const availableBalance = totalEarnings + referralEarnings;

      setStats({
        totalEarnings: totalEarnings + referralEarnings,
        availableBalance,
        pendingPayouts,
        todayEarnings,
        weeklyEarnings,
        monthlyEarnings,
        transactions: transactions || []
      });

    } catch (error) {
      console.error('Error fetching transaction data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refreshData: fetchTransactionData };
};
