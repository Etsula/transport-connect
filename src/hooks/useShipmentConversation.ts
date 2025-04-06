
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  id: string;
  senderId: string;
  senderType: "shipper" | "transporter";
  senderName: string;
  content: string;
  timestamp: string;
  shipmentId: string;
  created_at: string;
}

export const useShipmentConversation = (shipmentId: string, currentUserId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch existing messages for this shipment
    const fetchMessages = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from("shipment_messages")
          .select(`
            id,
            sender_id,
            sender_type,
            content,
            created_at,
            shipment_id,
            profiles(company_name)
          `)
          .eq("shipment_id", shipmentId)
          .order("created_at", { ascending: true });
          
        if (error) {
          console.error("Error fetching messages:", error);
          return;
        }

        // Format the messages for the UI
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          senderId: msg.sender_id,
          senderType: msg.sender_type as "shipper" | "transporter",
          senderName: msg.sender_id === currentUserId ? "You" : 
            (msg.profiles?.company_name || `User ${msg.sender_id.substring(0, 5)}`),
          content: msg.content,
          timestamp: new Date(msg.created_at).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          shipmentId: msg.shipment_id,
          created_at: msg.created_at
        }));
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error in fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('shipment-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'shipment_messages',
          filter: `shipment_id=eq.${shipmentId}`
        },
        async (payload) => {
          // When we get a new message, fetch the sender info
          const { data: profileData } = await supabase
            .from("profiles")
            .select("company_name")
            .eq("id", payload.new.sender_id)
            .single();
            
          const newMessage: Message = {
            id: payload.new.id,
            senderId: payload.new.sender_id,
            senderType: payload.new.sender_type,
            senderName: payload.new.sender_id === currentUserId ? "You" : 
              (profileData?.company_name || `User ${payload.new.sender_id.substring(0, 5)}`),
            content: payload.new.content,
            timestamp: new Date(payload.new.created_at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            shipmentId: payload.new.shipment_id,
            created_at: payload.new.created_at
          };
          
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [shipmentId, currentUserId]);

  const sendMessage = async (content: string) => {
    try {
      // Get user type
      const { data: profileData } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", currentUserId)
        .single();
      
      if (!profileData) {
        console.error("Could not determine user type");
        return false;
      }
      
      // Send the message to the database
      const { error } = await supabase
        .from("shipment_messages")
        .insert({
          shipment_id: shipmentId,
          sender_id: currentUserId,
          sender_type: profileData.user_type,
          content: content
        });
        
      if (error) {
        console.error("Error sending message:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in sending message:", error);
      return false;
    }
  };

  return {
    messages,
    loading,
    sendMessage
  };
};
