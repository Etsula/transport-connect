
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Truck, Shield } from "lucide-react";
import { useShipmentConversation } from "@/hooks/useShipmentConversation";
import { useToast } from "@/hooks/use-toast";
import MessageActions from "@/components/MessageActions";
import { supabase } from "@/integrations/supabase/client";

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
  const [contactInfo, setContactInfo] = useState<{ [userId: string]: { phone?: string, verified?: boolean } }>({});

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch contact information for users in the conversation
  useEffect(() => {
    const fetchContactInfo = async () => {
      const userIds = [...new Set(messages.map(m => m.senderId))];
      
      if (userIds.length === 0) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, phone")
          .in("id", userIds);
          
        if (error) throw error;
        
        // Also fetch verification status
        const { data: verificationData, error: verificationError } = await supabase
          .from("verification")
          .select("user_id, status")
          .in("user_id", userIds);
          
        if (verificationError) throw verificationError;
        
        const contactMap: { [userId: string]: { phone?: string, verified?: boolean } } = {};
        
        data?.forEach(user => {
          contactMap[user.id] = { phone: user.phone || undefined };
        });
        
        verificationData?.forEach(v => {
          if (contactMap[v.user_id]) {
            contactMap[v.user_id].verified = v.status === 'verified';
          } else {
            contactMap[v.user_id] = { verified: v.status === 'verified' };
          }
        });
        
        setContactInfo(contactMap);
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };
    
    fetchContactInfo();
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

  const handleDeleteMessage = (messageId: string) => {
    // This will refresh the messages from the hook after deletion
    toast({
      title: "Message deleted",
      description: "The message has been removed from the conversation",
    });
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
                      {contactInfo[message.senderId]?.verified && (
                        <Shield className="h-3 w-3 text-blue-400" />
                      )}
                    </div>
                    <p className="text-sm">{message.content}</p>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-xs opacity-70">
                        {message.timestamp}
                      </div>
                      <MessageActions
                        messageId={message.id}
                        onDelete={() => handleDeleteMessage(message.id)}
                        contactPhone={contactInfo[message.senderId]?.phone}
                        isCurrentUserMessage={message.senderId === currentUserId}
                        shipmentId={shipmentId}
                      />
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
