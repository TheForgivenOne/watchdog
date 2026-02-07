import { Routes, Route } from 'react-router';
import { Layout } from '../../core/components/Layout';
import { WeatherHome } from './pages/WeatherHome';

export default function WeatherRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<WeatherHome />} />
        <Route path="location/:lat/:lon" element={<WeatherHome />} />
      </Routes>
    </Layout>
  );
}
