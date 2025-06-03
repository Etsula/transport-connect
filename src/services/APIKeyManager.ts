
export interface APIKey {
  id: string;
  key: string;
  keyHash: string;
  clientName: string;
  clientEmail: string;
  environment: 'prod' | 'test' | 'dev';
  tier: 'starter' | 'business' | 'enterprise';
  rateLimit: number;
  monthlyQuota: number;
  currentUsage: number;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
  lastUsedAt?: string;
}

export class APIKeyManager {
  static generateAPIKey(environment: 'prod' | 'test' | 'dev' = 'prod'): string {
    const prefix = 'iship';
    const randomString = this.generateRandomString(16);
    const timestamp = Date.now().toString(36);
    const checksum = this.generateChecksum(prefix + environment + randomString + timestamp);
    
    return `${prefix}_${environment}_${randomString}${timestamp}_${checksum}`;
  }

  static async hashAPIKey(apiKey: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(apiKey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static validateKeyFormat(apiKey: string): boolean {
    const pattern = /^iship_(prod|test|dev)_[a-z0-9]{8,}_[a-z0-9]{4}$/;
    return pattern.test(apiKey);
  }

  static getTierLimits(tier: 'starter' | 'business' | 'enterprise') {
    const limits = {
      starter: { rateLimit: 1000, monthlyQuota: 10000, price: 10000 },
      business: { rateLimit: 10000, monthlyQuota: 100000, price: 50000 },
      enterprise: { rateLimit: 100000, monthlyQuota: -1, price: 200000 }
    };
    return limits[tier];
  }

  static async trackUsage(apiKeyId: string, endpoint: string, responseCode: number) {
    // This would integrate with your backend to track usage
    console.log('Tracking API usage:', { apiKeyId, endpoint, responseCode });
  }

  static async checkRateLimit(apiKey: APIKey): Promise<boolean> {
    // Implement rate limiting logic
    const now = new Date();
    const hourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
    
    // This would check against your backend rate limiting system
    return apiKey.currentUsage < apiKey.rateLimit;
  }

  // Browser-compatible random string generator
  private static generateRandomString(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }
    return result;
  }

  // Browser-compatible checksum generator
  private static generateChecksum(input: string): string {
    let hash = 0;
    if (input.length === 0) return hash.toString(16).padStart(4, '0');
    
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16).substring(0, 4).padStart(4, '0');
  }
}
