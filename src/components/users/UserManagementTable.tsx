
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useUserManagement } from '@/hooks/useUserManagement';
import { Search, Users, Shield, Eye, Edit, Trash2 } from 'lucide-react';

const UserManagementTable = () => {
  const { users, loading, searchUsers, updateUserStatus, getUserStats } = useUserManagement();
  const [searchQuery, setSearchQuery] = useState('');
  
  const stats = getUserStats();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchUsers(searchQuery);
    }
  };

  const toggleUserType = async (userId: string, newType: string) => {
    await updateUserStatus(userId, { user_type: newType });
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'shipper': return 'bg-blue-500';
      case 'transporter': return 'bg-green-500';
      case 'admin': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shippers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.shippers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transporters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.transporters}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              User Management
            </span>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Button type="submit" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Contact</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Joined</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <p className="font-medium">{user.company_name || 'No company'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge className={getUserTypeColor(user.user_type)}>
                        {user.user_type}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <p className="text-sm">{user.phone || 'No phone'}</p>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="default">
                          Active
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleUserType(user.id, user.user_type === 'admin' ? 'shipper' : 'admin')}
                        >
                          <Shield className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="p-2">
                      <p className="text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementTable;
