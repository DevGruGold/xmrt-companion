import React from 'react';
import { Droplet } from 'lucide-react';

interface WaterSafetyProps {
  country: string;
}

const WaterSafety: React.FC<WaterSafetyProps> = ({ country }) => {
  const getSafetyInfo = (country: string) => {
    // This would be expanded with a proper database of water safety information
    const defaultInfo = {
      safe: false,
      tips: ["Use bottled water", "Avoid tap water", "Be cautious with ice"],
    };
    return defaultInfo;
  };

  const info = getSafetyInfo(country);

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg animate-fade-up">
      <div className="flex items-center gap-3 mb-4">
        <Droplet className={info.safe ? "text-accent" : "text-secondary"} />
        <h2 className="text-xl font-semibold">Water Safety in {country}</h2>
      </div>
      <div className="space-y-4">
        <p className="text-gray-600">
          {info.safe 
            ? "Tap water is generally safe to drink."
            : "Exercise caution with tap water."}
        </p>
        <ul className="space-y-2">
          {info.tips.map((tip, index) => (
            <li key={index} className="flex items-center gap-2 text-gray-700">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WaterSafety;