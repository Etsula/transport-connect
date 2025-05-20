
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { TrashIcon, Share2, MoreHorizontal, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MessageActionsProps {
  messageId: string;
  onDelete: () => void;
  contactPhone?: string;
  isCurrentUserMessage: boolean;
  shipmentId: string;
}

const MessageActions = ({
  messageId,
  onDelete,
  contactPhone,
  isCurrentUserMessage,
  shipmentId
}: MessageActionsProps) => {
  const { toast } = useToast();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const handleDeleteMessage = async () => {
    try {
      const { error } = await supabase
        .from('shipment_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      toast({
        title: "Message deleted",
        description: "The message has been successfully deleted",
      });
      
      onDelete();
    } catch (error: any) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error",
        description: "Failed to delete the message",
        variant: "destructive",
      });
    } finally {
      setConfirmDeleteOpen(false);
    }
  };

  const openWhatsApp = () => {
    if (!contactPhone) {
      toast({
        title: "Contact information unavailable",
        description: "The phone number is not available for this contact",
        variant: "destructive",
      });
      return;
    }

    // Format phone number for WhatsApp (remove spaces, +, etc)
    const formattedPhone = contactPhone.replace(/\D/g, '');
    const shipmentReference = `regarding shipment #${shipmentId.slice(-6)}`;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(shipmentReference)}`, '_blank');
  };

  const openTelegram = () => {
    if (!contactPhone) {
      toast({
        title: "Contact information unavailable",
        description: "The phone number is not available for this contact",
        variant: "destructive",
      });
      return;
    }
    
    // Open Telegram with phone number
    window.open(`https://t.me/+${contactPhone.replace(/\D/g, '')}`, '_blank');
  };

  const handleReportMessage = async () => {
    try {
      // Add report to a reports table (this would need to be created)
      await supabase.from('message_reports').insert([{
        message_id: messageId,
        shipment_id: shipmentId,
        reason: "Inappropriate or suspicious content",
        status: "pending_review"
      }]);

      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our platform safe",
      });
    } catch (error) {
      console.error("Error reporting message:", error);
      toast({
        title: "Error",
        description: "Failed to submit your report",
        variant: "destructive",
      });
    } finally {
      setReportDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Message actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isCurrentUserMessage && (
            <>
              <DropdownMenuItem onClick={() => setConfirmDeleteOpen(true)} className="text-red-600">
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          
          <DropdownMenuItem onClick={openWhatsApp}>
            <img src="https://cdn.cdnlogo.com/logos/w/29/whatsapp-icon.svg" className="h-4 w-4 mr-2" alt="WhatsApp" />
            Continue on WhatsApp
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={openTelegram}>
            <img src="https://cdn.cdnlogo.com/logos/t/39/telegram.svg" className="h-4 w-4 mr-2" alt="Telegram" />
            Continue on Telegram
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {!isCurrentUserMessage && (
            <DropdownMenuItem onClick={() => setReportDialogOpen(true)} className="text-orange-600">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Message
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMessage}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Report Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to report this message for inappropriate or suspicious content?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReportMessage}>Report</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MessageActions;
