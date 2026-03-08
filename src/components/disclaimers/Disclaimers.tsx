
import React from 'react';
import { AlertTriangle, Shield, Clock } from 'lucide-react';

interface DisclaimerProps {
  type: 'liability' | 'privacy' | 'availability' | 'all';
  compact?: boolean;
}

const disclaimerContent = {
  liability: {
    icon: AlertTriangle,
    title: 'Liability Disclaimer',
    text: 'iShip acts solely as a platform connecting shippers and transporters. We are not liable for any loss, damage, delay, or destruction of goods during transit. All shipments are the sole responsibility of the transporter and shipper. Users are strongly encouraged to purchase appropriate insurance for valuable shipments. iShip does not guarantee the condition of goods upon delivery.'
  },
  privacy: {
    icon: Shield,
    title: 'Data & Privacy Notice',
    text: 'By using iShip, you consent to the collection, processing, and storage of personal data including location data for shipment tracking purposes. Location tracking is active only during active deliveries unless otherwise consented. Your data is processed in accordance with our Privacy Policy and applicable data protection regulations including GDPR. You may request data deletion at any time.'
  },
  availability: {
    icon: Clock,
    title: 'Service Availability',
    text: 'iShip does not guarantee the availability of transporters in your area or at any given time. Delivery time estimates are approximate and subject to change due to weather, traffic, customs processing, or other factors beyond our control. International shipments may experience additional delays due to customs clearance. Service availability may vary by region.'
  }
};

const Disclaimers = ({ type, compact = false }: DisclaimerProps) => {
  const types = type === 'all' ? ['liability', 'privacy', 'availability'] as const : [type] as const;

  return (
    <div className={`space-y-4 ${compact ? 'text-xs' : 'text-sm'}`}>
      {types.map((t) => {
        const content = disclaimerContent[t];
        const Icon = content.icon;
        return (
          <div key={t} className="flex gap-3 p-4 rounded-lg bg-muted/50 border border-border">
            <Icon className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-muted-foreground shrink-0 mt-0.5`} />
            <div>
              <p className="font-semibold text-foreground mb-1">{content.title}</p>
              <p className="text-muted-foreground leading-relaxed">{content.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const CompactDisclaimer = ({ type }: { type: 'liability' | 'privacy' | 'availability' }) => {
  const content = disclaimerContent[type];
  return (
    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
      <content.icon className="w-3 h-3" />
      {content.text.split('.')[0]}.
    </p>
  );
};

export default Disclaimers;
