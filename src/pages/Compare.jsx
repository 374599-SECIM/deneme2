import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import { useData } from '../DataContext';
import { indicators, mapScoreToColor } from '../data/mockData';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];

const Compare = () => {
    const { provinces } = useData();
    const [selectedIds, setSelectedIds] = useState(['TR-06', 'TR-34']);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const availableProvinces = provinces.filter(p => !selectedIds.includes(p.id));
    const filteredProvinces = availableProvinces.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const selectedProvinces = selectedIds.map(id => provinces.find(p => p.id === id)).filter(Boolean);

    const handleAdd = (id) => {
        if (selectedIds.length < 5) setSelectedIds([...selectedIds, id]);
        setIsDropdownOpen(false);
        setSearchQuery('');
    };

    const handleRemove = (id) => setSelectedIds(selectedIds.filter(selId => selId !== id));

    const chartData = useMemo(() => {
        return indicators.filter(ind => ind.id !== 'overall').map(ind => {
            const point = { subject: ind.name, fullMark: 100 };
            selectedProvinces.forEach(p => { point[p.name] = p.scores[ind.id]; });
            return point;
        });
    }, [selectedProvinces]);

    return (
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            <div>
                <h2 className="page-title">İl Karşılaştırma Analizi</h2>
                <p className="page-subtitle">En fazla 5 ili seçerek alt endekslerdeki performanslarını radar grafiği ile kıyaslayın.</p>
            </div>

            {/* Selector */}
            <div className="selector-bar" style={{ position: 'relative', zIndex: 110 }}>
                {selectedProvinces.map((p, idx) => (
                    <div key={p.id} className="selected-pill" style={{ borderColor: COLORS[idx] }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: COLORS[idx] }}></div>
                        <span>{p.name}</span>
                        <span className="grade-badge" style={{ backgroundColor: `${mapScoreToColor(p.grade)}25`, color: mapScoreToColor(p.grade), marginLeft: 8 }}>
                            {p.grade}
                        </span>
                        <button className="remove-btn" onClick={() => handleRemove(p.id)}>✕</button>
                    </div>
                ))}

                {selectedIds.length < 5 && (
                    <div style={{ position: 'relative' }}>
                        <button className="add-province-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                            + İl Ekle
                        </button>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <div style={{ padding: '12px', borderBottom: '1px solid var(--border-light)' }}>
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="İl ara..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                        style={{ padding: '8px 12px', fontSize: '13px', width: '100%' }}
                                    />
                                </div>
                                <div className="dropdown-scroll" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                                    {filteredProvinces.length > 0 ? filteredProvinces.map(p => (
                                        <button key={p.id} className="dropdown-item" onClick={() => handleAdd(p.id)}>
                                            {p.name} <span>#{p.rankCurrent}</span>
                                        </button>
                                    )) : (
                                        <div style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px' }}>Sonuç bulunamadı</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {selectedProvinces.length > 0 ? (
                <div className="compare-grid">

                    {/* Radar Chart */}
                    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 420 }}>
                        <h3 className="section-title" style={{ textAlign: 'center', width: '100%' }}>Alt Endeks Kıyaslaması</h3>
                        <div style={{ width: '100%', height: 380 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                                    <PolarGrid stroke="#334155" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    {selectedProvinces.map((p, idx) => (
                                        <Radar key={p.id} name={p.name} dataKey={p.name} stroke={COLORS[idx]} fill={COLORS[idx]} fillOpacity={0.35} />
                                    ))}
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Metrics Table */}
                    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 className="section-title">Detaylı Metrikler</h3>
                        <table className="compare-table">
                            <thead>
                                <tr>
                                    <th>Gösterge</th>
                                    {selectedProvinces.map((p, idx) => (
                                        <th key={p.id} style={{ color: COLORS[idx] }}>{p.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                                    <td style={{ fontWeight: 600 }}>Genel Sıralama Puanı</td>
                                    {selectedProvinces.map(p => (
                                        <td key={'ov' + p.id} style={{ fontWeight: 700 }}>
                                            {p.scores.overall.toFixed(1)} <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>#{p.rankCurrent}</span>
                                        </td>
                                    ))}
                                </tr>
                                {indicators.filter(i => i.id !== 'overall').map(ind => {
                                    const scores = selectedProvinces.map(sp => sp.scores[ind.id]);
                                    const maxScore = Math.max(...scores);
                                    return (
                                        <tr key={ind.id}>
                                            <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{ind.name}</td>
                                            {selectedProvinces.map((p, idx) => {
                                                const isMax = p.scores[ind.id] === maxScore && selectedProvinces.length > 1;
                                                return (
                                                    <td key={ind.id + p.id} style={{ fontWeight: isMax ? 700 : 400, color: isMax ? COLORS[idx] : 'var(--text-primary)' }}>
                                                        {p.scores[ind.id].toFixed(1)}
                                                        {isMax && <span className="leader-tag">Lider</span>}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                </div>
            ) : (
                <div className="glass-card empty-state">
                    <div className="empty-state-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Karşılaştırma Yapılacak İl Yok</h3>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: 400 }}>Yukarıdaki menüden analiz etmek istediğiniz illeri seçerek grafiksel karşılaştırmalarını görüntüleyebilirsiniz.</p>
                </div>
            )}

        </div>
    );
};

export default Compare;
