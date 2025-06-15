
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Star, Package, Shield, ChevronRight, AlertCircle } from 'lucide-react';
import { useReferralChain } from '@/hooks/useReferralChain';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const MultiLevelReferralManager: React.FC = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const { 
    chainMembers, 
    loading, 
    checkChainDistance, 
    canSendToRegion, 
    addToReferralChain,
    updateQualifications 
  } = useReferralChain();
  
  const [newUserEmail, setNewUserEmail] = useState('');
  const [targetCountry, setTargetCountry] = useState('');
  const [checking, setChecking] = useState(false);

  const handleAddToChain = async () => {
    if (!newUserEmail) return;

    try {
      setChecking(true);
      // In a real implementation, you'd look up the user by email
      // For now, we'll simulate with a mock user ID
      const mockUserId = 'mock-user-' + Date.now();
      const referralCode = 'REF-' + Math.random().toString(36).substr(2, 9);
      
      const success = await addToReferralChain(mockUserId, referralCode);
      if (success) {
        setNewUserEmail('');
      }
    } catch (error) {
      console.error('Error adding to chain:', error);
    } finally {
      setChecking(false);
    }
  };

  const checkRegionalAccess = async () => {
    if (!targetCountry) return;

    try {
      setChecking(true);
      const mockTargetUserId = 'mock-target-' + Date.now();
      const canSend = await canSendToRegion(mockTargetUserId, targetCountry.toUpperCase());
      
      toast({
        title: canSend ? "Access granted" : "Access denied",
        description: canSend 
          ? `You can send packages to ${targetCountry}` 
          : `You cannot send to ${targetCountry} - check referral chain requirements`,
        variant: canSend ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Error checking access:', error);
    } finally {
      setChecking(false);
    }
  };

  const getLevelColor = (level: number) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800', 
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-red-100 text-red-800'
    ];
    return colors[level - 1] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Multi-Level Referral Chain
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">Referral Requirements</span>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Must have 10+ completed deliveries</li>
              <li>• Must maintain 5.0 star rating</li>
              <li>• Maximum 5 levels in referral chain</li>
              <li>• Regional access limited by chain distance</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Add User to Chain</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter user email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
                <Button 
                  onClick={handleAddToChain}
                  disabled={checking || !newUserEmail}
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Check Regional Access</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Country code (e.g., UK, US)"
                  value={targetCountry}
                  onChange={(e) => setTargetCountry(e.target.value)}
                />
                <Button 
                  onClick={checkRegionalAccess}
                  disabled={checking || !targetCountry}
                  variant="outline"
                >
                  Check
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Chain</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : chainMembers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No referral chain members yet. Start by referring highly-rated users!
            </p>
          ) : (
            <div className="space-y-3">
              {chainMembers.map((member, index) => (
                <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Badge className={getLevelColor(member.chain_level)}>
                    Level {member.chain_level}
                  </Badge>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">User {member.user_id.slice(-8)}</span>
                      {member.is_qualified && (
                        <Shield className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {member.total_deliveries} deliveries
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {member.average_rating.toFixed(1)} rating
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={member.can_refer ? "default" : "secondary"}>
                      {member.can_refer ? 'Can Refer' : 'Cannot Refer'}
                    </Badge>
                    
                    {member.can_refer && (
                      <span className="text-sm text-gray-500">
                        {member.current_referrals}/{member.max_referrals}
                      </span>
                    )}
                  </div>
                  
                  {index < chainMembers.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiLevelReferralManager;
