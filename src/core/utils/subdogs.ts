import type { Subdog } from '../types';

export const subdogs: Subdog[] = [
  {
    id: 'news',
    name: 'News',
    description: 'Stay informed with the latest headlines and breaking news',
    path: '/news',
    icon: 'Newspaper',
    color: 'blue'
  },
  {
    id: 'weather',
    name: 'Weather',
    description: 'Check current conditions and forecasts for your location',
    path: '/weather',
    icon: 'Cloud',
    color: 'sky'
  }
];
