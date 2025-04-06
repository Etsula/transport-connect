
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Truck } from "lucide-react";
import { useShipmentConversation } from "@/hooks/useShipmentConversation";
import { useToast } from "@/hooks/use-toast";

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
  const [newMessage, setNewMessage] = useState("");
  const { messages, loading, sendMessage } = useShipmentConversation(shipmentId, currentUserId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const success = await sendMessage(newMessage);
      
      if (success) {
        setNewMessage("");
      } else {
        toast({
          title: "Failed to send message",
          description: "Please try again later",
          variant: "destructive",
        });
      }
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
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
            </div>
          ) : (
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
          )}
        </div>
        
        <div className="p-4 border-t mt-auto">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
              disabled={loading}
            />
            <Button onClick={handleSendMessage} disabled={loading || !newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentMessaging;
