import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PieChart, LogIn } from 'lucide-react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Rankings from './pages/Rankings';
import Compare from './pages/Compare';
import ProvinceDetail from './pages/ProvinceDetail';

import { DataProvider } from './DataContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('site_auth');
    if (auth === 'asosa') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'asosa') {
      localStorage.setItem('site_auth', 'asosa');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Hatalı şifre. Lütfen tekrar deneyin.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        fontFamily: "'Inter', sans-serif",
        background: 'linear-gradient(135deg, #0c1445 0%, #1a237e 50%, #283593 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          padding: '50px 40px',
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ fontSize: '3em', color: '#1a237e', marginBottom: '15px' }}>
            <PieChart size={56} strokeWidth={2} />
          </div>
          <h1 style={{
            fontSize: '1.8em',
            fontWeight: 700,
            color: '#1a237e',
            marginBottom: '8px',
          }}>ASO</h1>
          <p style={{ color: '#6c757d', marginBottom: '30px' }}>Veri Analitiği Dashboard</p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin..."
              autoFocus
              style={{
                width: '100%',
                borderRadius: '12px',
                padding: '14px 20px',
                fontSize: '1em',
                border: '2px solid #e0e0e0',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s',
                marginBottom: '10px',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#1a237e'; e.target.style.boxShadow = '0 0 0 3px rgba(26,35,126,0.15)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.boxShadow = 'none'; }}
            />

            {error && (
              <p style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '10px' }}>{error}</p>
            )}

            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #1a237e, #283593)',
                border: 'none',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '1.05em',
                fontWeight: 600,
                color: 'white',
                width: '100%',
                marginTop: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(26,35,126,0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <LogIn size={20} strokeWidth={2.5} />
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <DataProvider>
      <BrowserRouter basename="/deneme2">
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
