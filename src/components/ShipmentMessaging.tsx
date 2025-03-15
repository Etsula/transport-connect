
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Truck } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderType: "shipper" | "transporter";
  senderName: string;
  content: string;
  timestamp: string;
}

interface ShipmentMessagingProps {
  shipmentId: string;
  shipmentTitle: string;
  currentUserId: string;
  currentUserType: "shipper" | "transporter";
}

const ShipmentMessaging = ({
  shipmentId,
  shipmentTitle,
  currentUserId,
  currentUserType,
}: ShipmentMessagingProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration - in a real app, fetch from your backend
  useEffect(() => {
    // Simulating message history
    const mockMessages: Message[] = [
      {
        id: "1",
        senderId: "transporter-123",
        senderType: "transporter",
        senderName: "John (Driver)",
        content: "Hello! I'll be delivering your package today.",
        timestamp: "10:15 AM",
      },
      {
        id: "2",
        senderId: "shipper-456",
        senderType: "shipper",
        senderName: "You",
        content: "Great! What's the estimated delivery time?",
        timestamp: "10:17 AM",
      },
      {
        id: "3",
        senderId: "transporter-123",
        senderType: "transporter",
        senderName: "John (Driver)",
        content: "I should arrive between 2-3 PM. There's some traffic on the highway.",
        timestamp: "10:20 AM",
      },
    ];
    
    setMessages(mockMessages);
  }, [shipmentId]);

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        senderId: currentUserId,
        senderType: currentUserType,
        senderName: currentUserType === "shipper" ? "You" : "You (Driver)",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="text-xl">
          Messages for Shipment #{shipmentId.slice(-6)}
        </CardTitle>
        <p className="text-sm text-gray-500">{shipmentTitle}</p>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.senderType === currentUserType ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.senderType === currentUserType 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.senderType === "transporter" ? (
                      <Truck className="h-3 w-3" />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                    <span className="text-xs font-medium">{message.senderName}</span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                  <div className="text-xs mt-1 opacity-70 text-right">
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <div className="p-4 border-t mt-auto">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentMessaging;
