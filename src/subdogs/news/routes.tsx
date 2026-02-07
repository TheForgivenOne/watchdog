import { Routes, Route } from 'react-router';
import { Layout } from '../../core/components/Layout';
import { NewsHome } from './pages/NewsHome';

export default function NewsRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<NewsHome />} />
        <Route path="article/:id" element={<div className="p-8 text-center text-slate-400">Article detail coming soon</div>} />
      </Routes>
    </Layout>
  );
}
