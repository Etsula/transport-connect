
import { createHash, randomBytes } from 'crypto';

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
    const randomString = randomBytes(8).toString('hex');
    const timestamp = Date.now().toString(36);
    const checksum = createHash('md5')
      .update(prefix + environment + randomString + timestamp)
      .digest('hex')
      .substring(0, 4);
    
    return `${prefix}_${environment}_${randomString}${timestamp}_${checksum}`;
  }

  static hashAPIKey(apiKey: string): string {
    return createHash('sha256').update(apiKey).digest('hex');
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
}
