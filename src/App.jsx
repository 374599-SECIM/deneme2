import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Rankings from './pages/Rankings';
import Compare from './pages/Compare';
import ProvinceDetail from './pages/ProvinceDetail';

import { DataProvider } from './DataContext';

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/province/:id" element={<ProvinceDetail />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
