
interface MessageData {
  recipient: string;
  message: string;
  type: 'whatsapp' | 'sms';
  template?: string;
  variables?: Record<string, string>;
}

interface ShipmentUpdate {
  shipmentId: string;
  status: string;
  location?: string;
  eta?: string;
  riderName?: string;
  riderPhone?: string;
}

export class ExternalMessagingService {
  private static whatsappAPIKey = process.env.WHATSAPP_API_KEY || '';
  private static smsAPIKey = process.env.SMS_API_KEY || '';
  private static baseURL = 'https://api.iship.co.ke/v1';

  // Send shipment updates via WhatsApp (like Uber)
  static async sendShipmentUpdate(update: ShipmentUpdate, recipientPhone: string) {
    const templates = {
      pickup_confirmed: `🚚 *iShip Update*\n\nYour shipment #${update.shipmentId} has been picked up!\n\nRider: ${update.riderName}\nPhone: ${update.riderPhone}\nETA: ${update.eta}\n\nTrack: https://iship.co.ke/track/${update.shipmentId}`,
      
      in_transit: `🛣️ *On the way!*\n\nYour package is moving!\nCurrent location: ${update.location}\nETA: ${update.eta}\n\nTrack live: https://iship.co.ke/track/${update.shipmentId}`,
      
      delivered: `✅ *Delivered!*\n\nYour shipment #${update.shipmentId} has been delivered successfully!\n\nThank you for using iShip!\nRate your experience: https://iship.co.ke/rate/${update.shipmentId}`,
      
      delayed: `⏰ *Slight delay*\n\nYour delivery is running a bit late due to traffic.\nNew ETA: ${update.eta}\n\nWe apologize for the inconvenience.\nRider: ${update.riderPhone}`
    };

    const message = templates[update.status as keyof typeof templates] || 
                   `iShip Update: Your shipment #${update.shipmentId} status is now ${update.status}`;

    return this.sendWhatsApp({
      recipient: recipientPhone,
      message,
      type: 'whatsapp'
    });
  }

  // Send rider notifications
  static async notifyRider(riderId: string, message: string, phone: string) {
    const riderMessage = `🏍️ *iShip - New Job Alert*\n\n${message}\n\nAccept in the app to start earning!`;
    
    return this.sendWhatsApp({
      recipient: phone,
      message: riderMessage,
      type: 'whatsapp'
    });
  }

  // Send payment confirmations
  static async sendPaymentConfirmation(amount: number, recipientPhone: string, shipmentId: string) {
    const message = `💰 *Payment Confirmed*\n\nKSh ${amount.toLocaleString()} received for shipment #${shipmentId}\n\nThank you for using iShip!`;
    
    return this.sendWhatsApp({
      recipient: recipientPhone,
      message,
      type: 'whatsapp'
    });
  }

  // Send emergency alerts
  static async sendEmergencyAlert(riderId: string, location: string, emergencyContacts: string[]) {
    const message = `🚨 *EMERGENCY ALERT*\n\nRider needs assistance!\nLocation: ${location}\nTime: ${new Date().toLocaleString()}\n\nPlease contact immediately.`;
    
    // Send to multiple emergency contacts
    const promises = emergencyContacts.map(contact => 
      this.sendSMS({
        recipient: contact,
        message,
        type: 'sms'
      })
    );

    return Promise.all(promises);
  }

  // Core WhatsApp sending function
  private static async sendWhatsApp(data: MessageData) {
    try {
      const response = await fetch(`${this.baseURL}/whatsapp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.whatsappAPIKey}`
        },
        body: JSON.stringify({
          to: data.recipient,
          type: 'text',
          text: {
            body: data.message
          }
        })
      });

      return await response.json();
    } catch (error) {
      console.error('WhatsApp send error:', error);
      // Fallback to SMS if WhatsApp fails
      return this.sendSMS(data);
    }
  }

  // Core SMS sending function
  private static async sendSMS(data: MessageData) {
    try {
      const response = await fetch(`${this.baseURL}/sms/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.smsAPIKey}`
        },
        body: JSON.stringify({
          to: data.recipient,
          message: data.message
        })
      });

      return await response.json();
    } catch (error) {
      console.error('SMS send error:', error);
      throw error;
    }
  }

  // Bulk notifications for promotions
  static async sendBulkPromotion(contacts: string[], message: string) {
    const promises = contacts.map(contact => 
      this.sendWhatsApp({
        recipient: contact,
        message,
        type: 'whatsapp'
      })
    );

    return Promise.all(promises);
  }

  // Send referral invitations
  static async sendReferralInvitation(referrerName: string, recipientPhone: string, referralCode: string) {
    const message = `🎉 *Join iShip & Earn!*\n\n${referrerName} invited you to join iShip!\n\nUse code: *${referralCode}*\nGet KSh 200 bonus on signup!\n\nDownload: https://iship.co.ke/join?ref=${referralCode}`;
    
    return this.sendWhatsApp({
      recipient: recipientPhone,
      message,
      type: 'whatsapp'
    });
  }
}
