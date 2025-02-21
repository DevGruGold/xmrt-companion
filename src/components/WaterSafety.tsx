
import React, { useEffect, useState } from 'react';
import { Droplet } from 'lucide-react';
import { WaterSafetyInfo, getWaterSafetyInfo } from '@/services/travelPlannerService';

interface WaterSafetyProps {
  country: string;
}

const WaterSafety: React.FC<WaterSafetyProps> = ({ country }) => {
  const [info, setInfo] = useState<WaterSafetyInfo>({
    safe: false,
    tips: ["Loading water safety information..."],
    description: "Loading..."
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWaterSafety = async () => {
      if (country && country !== "Loading...") {
        setLoading(true);
        try {
          const safetyInfo = await getWaterSafetyInfo(country);
          setInfo(safetyInfo);
        } catch (error) {
          console.error('Error fetching water safety info:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWaterSafety();
  }, [country]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg animate-fade-up">
      <div className="flex items-center gap-3 mb-4">
        <Droplet className={info.safe ? "text-accent" : "text-secondary"} />
        <h2 className="text-xl font-semibold">Water Safety in {country}</h2>
      </div>
      <div className="space-y-4">
        <p className="text-gray-600">
          {loading ? "Loading water safety information..." : info.description}
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
