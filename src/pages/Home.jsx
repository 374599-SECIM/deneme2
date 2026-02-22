import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TurkeyMap from '../components/TurkeyMap';
import { useData } from '../DataContext';
import { indicators, mapScoreToColor } from '../data/mockData';

const Home = () => {
    const { provinces } = useData();
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState('overall');

    const allSortedProvinces = [...provinces]
        .sort((a, b) => b.scores[activeIndex] - a.scores[activeIndex]);

    return (
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Header */}
            <div className="flex justify-between items-start flex-wrap gap-6">
                <div style={{ maxWidth: '560px' }}>
                    <h2 className="page-title">
                        İllerin Teknolojik<br />
                        <span className="text-gradient">Gelişmişlik Endeksi</span>
                    </h2>
                    <p className="page-subtitle">
                        ASO-İLTEK 2025 vizyonuyla Türkiye'nin rekabet gücünü, 37 gösterge ve 5 ana endeks üzerinden interaktif olarak inceleyin.
                    </p>
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="filter-bar">
                {indicators.map((ind) => (
                    <button
                        key={ind.id}
                        onClick={() => setActiveIndex(ind.id)}
                        className={`filter-btn ${activeIndex === ind.id ? 'active' : ''}`}
                    >
                        {ind.name}
                    </button>
                ))}
            </div>

            {/* Map */}
            <TurkeyMap activeIndex={activeIndex} />

            {/* Leaderboard */}
            <div>
                <h3 className="section-title">
                    Türkiye Sıralaması — {indicators.find(i => i.id === activeIndex)?.name}
                </h3>
                <div className="data-table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>İl</th>
                                <th>Puan</th>
                                <th>Not</th>
                                <th>Politika Önerisi</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {allSortedProvinces.map((p, idx) => (
                                <tr key={p.id} onClick={() => navigate(`/province/${p.id}`)}>
                                    <td className="muted" style={{ fontWeight: 700 }}>{idx + 1}</td>
                                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                                    <td className="tabular">{p.scores[activeIndex].toFixed(1)}</td>
                                    <td>
                                        <span
                                            className="grade-badge"
                                            style={{ backgroundColor: `${mapScoreToColor(p.grade)}25`, color: mapScoreToColor(p.grade) }}
                                        >
                                            {p.grade}
                                        </span>
                                    </td>
                                    <td className="muted truncate">{p.policy}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.3 }}><polyline points="9 18 15 12 9 6" /></svg>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default Home;
