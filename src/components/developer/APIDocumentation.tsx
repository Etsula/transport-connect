
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Code, BookOpen } from 'lucide-react';

const APIDocumentation = () => {
  const endpoints = [
    {
      method: 'POST',
      path: '/deliveries',
      description: 'Create a new delivery order',
      auth: 'Bearer token required'
    },
    {
      method: 'GET',
      path: '/deliveries/{id}/track',
      description: 'Track delivery in real-time',
      auth: 'Bearer token required'
    },
    {
      method: 'GET',
      path: '/riders/available',
      description: 'Get available riders in area',
      auth: 'Bearer token required'
    },
    {
      method: 'POST',
      path: '/payments/mpesa',
      description: 'Process M-Pesa payment',
      auth: 'Bearer token required'
    },
    {
      method: 'POST',
      path: '/routing/optimize',
      description: 'Optimize delivery routes',
      auth: 'Bearer token required'
    }
  ];

  const examples = {
    createDelivery: `{
  "pickup_address": "Westlands, Nairobi",
  "delivery_address": "Karen, Nairobi", 
  "package_type": "electronics",
  "package_value": 15000,
  "customer_phone": "+254712345678",
  "priority_level": "high"
}`,
    trackDelivery: `{
  "id": "del_1234567890",
  "status": "in_transit",
  "location": {
    "lat": -1.2921,
    "lng": 36.8219
  },
  "eta": 25,
  "rider_info": {
    "name": "John Doe",
    "phone": "+254701234567",
    "rating": 4.8
  }
}`
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            API Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center">
                <ExternalLink className="mr-2 h-4 w-4" />
                Interactive Docs
              </Button>
              <Button variant="outline" className="flex items-center">
                <Code className="mr-2 h-4 w-4" />
                Postman Collection
              </Button>
              <Button variant="outline" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                SDK Downloads
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Base URL</h4>
              <code className="text-sm bg-white p-2 rounded border">
                https://api.iship.co.ke/v1
              </code>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Authentication</h4>
              <code className="text-sm bg-white p-2 rounded border">
                Authorization: Bearer your_api_key_here
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={endpoint.method === 'GET' ? 'default' : 'secondary'}>
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm">{endpoint.path}</code>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {endpoint.auth}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{endpoint.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Example Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium">POST /deliveries</p>
              <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                {examples.createDelivery}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Example Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium">GET /deliveries/123/track</p>
              <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                {examples.trackDelivery}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default APIDocumentation;
