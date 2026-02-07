import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudDrizzle, CloudSun } from 'lucide-react';
import { getWeatherCodeInfo } from '../utils/helpers';

interface WeatherIconProps {
  code: number;
  className?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  sun: Sun,
  'cloud-sun': CloudSun,
  cloud: Cloud,
  'cloud-fog': CloudFog,
  'cloud-drizzle': CloudDrizzle,
  'cloud-rain': CloudRain,
  'cloud-snow': CloudSnow,
  'cloud-lightning': CloudLightning,
};

export function WeatherIcon({ code, className = 'w-6 h-6' }: WeatherIconProps) {
  const { icon } = getWeatherCodeInfo(code);
  const IconComponent = iconMap[icon] || Cloud;

  return <IconComponent className={className} />;
}
