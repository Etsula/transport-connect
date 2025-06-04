
interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{ href: string; rel: string; method: string }>;
}

interface PayPalCaptureResponse {
  id: string;
  status: string;
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: { currency_code: string; value: string };
      }>;
    };
  }>;
}

export class PayPalService {
  private baseURL: string;
  private clientId: string;
  private clientSecret: string;

  constructor(isProduction = true) {
    this.baseURL = isProduction 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';
    this.clientId = process.env.PAYPAL_CLIENT_ID || '';
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
  }

  async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
    const response = await fetch(`${this.baseURL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token;
  }

  async createOrder(amount: number, currency = 'USD'): Promise<PayPalOrderResponse> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseURL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
        }],
        application_context: {
          return_url: `${window.location.origin}/payment-success`,
          cancel_url: `${window.location.origin}/payment-cancel`,
        },
      }),
    });

    return response.json();
  }

  async captureOrder(orderId: string): Promise<PayPalCaptureResponse> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseURL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    return response.json();
  }

  async createPayout(payouts: Array<{ email: string; amount: number; currency?: string }>) {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseURL}/v1/payments/payouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        sender_batch_header: {
          sender_batch_id: `batch_${Date.now()}`,
          email_subject: 'iShip Referral Payout',
          email_message: 'You have received a referral payout from iShip!',
        },
        items: payouts.map((payout, index) => ({
          recipient_type: 'EMAIL',
          amount: {
            value: payout.amount.toFixed(2),
            currency: payout.currency || 'USD',
          },
          receiver: payout.email,
          note: 'Referral commission payout',
          sender_item_id: `item_${index}`,
        })),
      }),
    });

    return response.json();
  }
}
