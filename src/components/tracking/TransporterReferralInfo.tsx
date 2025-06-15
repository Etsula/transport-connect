
import React from "react";

interface TransporterReferralInfoProps {
  referredBy?: string;
}
const TransporterReferralInfo: React.FC<TransporterReferralInfoProps> = ({ referredBy }) => {
  if (!referredBy) return null;
  return (
    <div>
      <p className="text-sm font-medium text-gray-700">Referred By</p>
      <p className="text-blue-600">{referredBy}</p>
    </div>
  );
};
export default TransporterReferralInfo;
