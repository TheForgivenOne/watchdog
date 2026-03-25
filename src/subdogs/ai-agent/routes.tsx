import { Routes, Route } from 'react-router';
import { Layout } from '../../core/components/Layout';
import { AiAgentHome } from './pages/AiAgentHome';

export default function AiAgentRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AiAgentHome />} />
      </Routes>
    </Layout>
  );
}
