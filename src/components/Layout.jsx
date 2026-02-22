import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useData } from '../DataContext';

const Layout = ({ children }) => {
    const { provinces, globalYear, setGlobalYear } = useData();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isYearOpen, setIsYearOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef(null);
    const location = useLocation();

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close dropdown on route change
    useEffect(() => {
        setIsDropdownOpen(false);
        setIsYearOpen(false);
        setSearchQuery('');
    }, [location.pathname]);

    const filteredProvinces = provinces.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="app-layout">
            <header className="top-nav" style={{ justifyContent: 'center' }}>

                <nav className="nav-links">
                    <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                        <span>Harita & Özet</span>
                    </NavLink>
                    <NavLink to="/rankings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                        <span>Tüm Sıralama</span>
                    </NavLink>
                    <NavLink to="/compare" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                        <span>Karşılaştırma</span>
                    </NavLink>

                    {/* Year Selector Dropdown */}
                    <div className="nav-dropdown" style={{ marginLeft: '12px', marginRight: '4px' }}>
                        <button
                            className="nav-item flex items-center"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}
                            onClick={() => setIsYearOpen(!isYearOpen)}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <span>{globalYear} Yılı</span>
                            <svg className="dropdown-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 4 }}><polyline points={isYearOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline></svg>
                        </button>

                        {isYearOpen && (
                            <div className="dropdown-menu" style={{ width: '140px', left: 'auto', right: 0 }}>
                                {[2025, 2024, 2023].map(yr => (
                                    <button
                                        key={yr}
                                        className="dropdown-item"
                                        style={{ fontWeight: globalYear === yr ? 700 : 400, color: globalYear === yr ? 'var(--accent-blue)' : 'var(--text-primary)' }}
                                        onClick={() => { setGlobalYear(yr); setIsYearOpen(false); }}
                                    >
                                        {yr} {globalYear === yr && '✓'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="nav-dropdown" ref={dropdownRef}>
                        <button
                            className={`nav-item flex items-center ${location.pathname.includes('/province/') ? 'active' : ''}`}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            <span>İl Sayfaları</span>
                            <svg className="dropdown-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 4 }}><polyline points={isDropdownOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline></svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="dropdown-menu provinces-dropdown">
                                <div style={{ padding: '12px', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="İl ara..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ padding: '8px 12px', fontSize: '13px', width: '100%', outline: 'none', background: 'var(--bg-card)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)' }}
                                    />
                                </div>
                                <div className="dropdown-scroll" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                    {filteredProvinces.length > 0 ? filteredProvinces.map(p => (
                                        <Link key={p.id} to={`/province/${p.id}`} className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                            {p.name} <span style={{ color: 'var(--text-muted)' }}>#{p.rankCurrent}</span>
                                        </Link>
                                    )) : (
                                        <div style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center' }}>Sonuç bulunamadı</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            <main className="main-content">
                <div className="main-container">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
