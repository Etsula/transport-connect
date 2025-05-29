
// ============================================================================
// BODA DELIVERY API INTEGRATION
// ============================================================================

interface DeliveryRequest {
  pickupAddress: string;
  deliveryAddress: string;
  packageType: string;
  packageValue: number;
  customerPhone: string;
  priority?: 'standard' | 'high' | 'urgent';
  urgencyLevel?: number;
  sentiment?: 'happy' | 'neutral' | 'frustrated';
  instructions?: string;
  scheduledTime?: string;
  paymentMethod?: string;
}

interface TrackingData {
  id: string;
  status: string;
  location: { lat: number; lng: number };
  eta: number;
  delay_minutes: number;
  confidence_level: number;
  rider_info: {
    name: string;
    phone: string;
    rating: number;
  };
}

class BodaDeliveryAPI {
  private apiKey: string;
  private baseURL: string = 'https://api.iship.co.ke/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createDelivery(orderData: DeliveryRequest) {
    const endpoint = `${this.baseURL}/deliveries`;
    return await this.makeRequest('POST', endpoint, {
      pickup_address: orderData.pickupAddress,
      delivery_address: orderData.deliveryAddress,
      package_type: orderData.packageType,
      package_value: orderData.packageValue,
      delivery_instructions: orderData.instructions,
      customer_phone: orderData.customerPhone,
      priority_level: orderData.priority || 'standard',
      scheduled_time: orderData.scheduledTime,
      payment_method: orderData.paymentMethod,
      urgency_level: orderData.urgencyLevel,
      customer_sentiment: orderData.sentiment
    });
  }

  async trackDelivery(deliveryId: string) {
    const endpoint = `${this.baseURL}/deliveries/${deliveryId}/track`;
    const response = await this.makeRequest('GET', endpoint);
    
    return {
      ...response,
      comfort_metrics: {
        confidence_score: this.calculateConfidenceScore(response),
        eta_reliability: this.calculateETAReliability(response),
        peace_of_mind_score: this.calculatePeaceOfMind(response)
      }
    };
  }

  async assignRider(deliveryId: string, preferences: any = {}) {
    const endpoint = `${this.baseURL}/deliveries/${deliveryId}/assign`;
    return await this.makeRequest('POST', endpoint, {
      rider_preferences: {
        experience_level: preferences.experienceLevel,
        rating_threshold: preferences.minRating || 4.0,
        personality_match: preferences.personalityMatch,
        language_preference: preferences.language,
        customer_anxiety_level: preferences.customerAnxiety,
        communication_style: preferences.communicationStyle
      }
    });
  }

  async calculatePricing(deliveryRequest: any) {
    const endpoint = `${this.baseURL}/pricing/calculate`;
    return await this.makeRequest('POST', endpoint, {
      distance_km: deliveryRequest.distance,
      package_type: deliveryRequest.packageType,
      urgency: deliveryRequest.urgency,
      weather_conditions: deliveryRequest.weather,
      show_breakdown: true,
      compare_with_alternatives: true,
      justify_premium: true
    });
  }

  async processMpesaPayment(paymentData: any) {
    const endpoint = `${this.baseURL}/payments/mpesa`;
    return await this.makeRequest('POST', endpoint, {
      phone_number: paymentData.phoneNumber,
      amount: paymentData.amount,
      delivery_id: paymentData.deliveryId,
      payment_description: `Delivery to ${paymentData.customerName}`,
      success_message_personalized: true,
      instant_confirmation: true
    });
  }

  private calculateConfidenceScore(trackingData: any): number {
    let score = 100;
    
    if (trackingData.delay_minutes > 15) score -= 20;
    if (trackingData.delay_minutes > 30) score -= 30;
    if (trackingData.proactive_updates) score += 10;
    if (trackingData.rider_rating > 4.5) score += 15;
    
    return Math.max(0, Math.min(100, score));
  }

  private calculateETAReliability(trackingData: any): number {
    return trackingData.confidence_level * 100;
  }

  private calculatePeaceOfMind(trackingData: any): number {
    const factors = [
      trackingData.rider_rating > 4.0 ? 25 : 0,
      trackingData.delay_minutes < 10 ? 25 : 0,
      trackingData.proactive_updates ? 25 : 0,
      trackingData.location_accuracy > 0.9 ? 25 : 0
    ];
    return factors.reduce((sum, factor) => sum + factor, 0);
  }

  private async makeRequest(method: string, url: string, data: any = null) {
    const options: RequestInit = {
      method: method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'X-API-Version': '1.0',
        'X-Client-Platform': 'boda-delivery-app'
      }
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'API request failed');
      }
      
      return result;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }
}

export default BodaDeliveryAPI;
