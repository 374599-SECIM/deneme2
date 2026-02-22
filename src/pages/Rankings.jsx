import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../DataContext';
import { indicators, mapScoreToColor } from '../data/mockData';

const Rankings = () => {
    const { provinces } = useData();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'overall', direction: 'desc' });
    const [gradeFilter, setGradeFilter] = useState('ALL');

    const uniqueGrades = ['ALL', ...new Set(provinces.map(p => p.grade))].sort();

    const handleSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const sortedAndFiltered = [...provinces]
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(p => gradeFilter === 'ALL' || p.grade === gradeFilter)
        .sort((a, b) => {
            let aValue = a.scores[sortConfig.key] || a[sortConfig.key];
            let bValue = b.scores[sortConfig.key] || b[sortConfig.key];
            if (typeof aValue === 'string') {
                return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        });

    const SortIcon = ({ sortKey }) => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ opacity: sortConfig.key === sortKey ? 1 : 0.3, color: sortConfig.key === sortKey ? 'var(--accent-blue)' : 'inherit', marginLeft: '4px' }}>
            <path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4" />
        </svg>
    );

    return (
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            <div className="flex justify-between items-end flex-wrap gap-4">
                <div>
                    <h2 className="page-title">Tüm Sıralama</h2>
                    <p className="page-subtitle">81 ilin detaylı ASO-İLTEK skorlarına göz atın.</p>
                </div>
                <div className="search-bar">
                    <div className="search-input-wrap">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input
                            type="text"
                            placeholder="İl Ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="filter-select">
                        {uniqueGrades.map(g => (
                            <option key={g} value={g}>{g === 'ALL' ? 'Tüm Notlar' : g}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="data-table-wrapper">
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('rank2025')} className={sortConfig.key === 'rank2025' ? 'active' : ''}>
                                    # <SortIcon sortKey="rank2025" />
                                </th>
                                <th onClick={() => handleSort('name')} className={sortConfig.key === 'name' ? 'active' : ''}>
                                    İl <SortIcon sortKey="name" />
                                </th>
                                <th onClick={() => handleSort('grade')} className={sortConfig.key === 'grade' ? 'active' : ''}>
                                    Not <SortIcon sortKey="grade" />
                                </th>
                                {indicators.map(ind => (
                                    <th key={ind.id} onClick={() => handleSort(ind.id)} className={`text-right ${sortConfig.key === ind.id ? 'active' : ''}`}>
                                        {ind.name} <SortIcon sortKey={ind.id} />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAndFiltered.map((p, idx) => (
                                <tr key={p.id} onClick={() => navigate(`/province/${p.id}`)}>
                                    <td className="muted tabular">{p.rankCurrent}</td>
                                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                                    <td>
                                        <span className="grade-badge" style={{ backgroundColor: `${mapScoreToColor(p.grade)}25`, color: mapScoreToColor(p.grade) }}>
                                            {p.grade}
                                        </span>
                                    </td>
                                    {indicators.map(ind => (
                                        <td key={ind.id} className={`text-right tabular ${ind.id === 'overall' ? 'bold' : ''}`}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                                {p.scores[ind.id].toFixed(1)}
                                                {ind.id !== 'overall' && p.prevScores && p.prevScores[ind.id] !== undefined && (
                                                    <div className="rank-change-indicator-wrap">
                                                        <div style={{ color: p.scores[ind.id] > p.prevScores[ind.id] ? '#10b981' : (p.scores[ind.id] < p.prevScores[ind.id] ? '#ef4444' : 'var(--text-secondary)') }}>
                                                            {p.scores[ind.id] > p.prevScores[ind.id] ? '▲' : (p.scores[ind.id] < p.prevScores[ind.id] ? '▼' : '▬')}
                                                        </div>
                                                        <div className="rank-change-tooltip">
                                                            Önceki: {p.prevScores[ind.id].toFixed(1)}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {sortedAndFiltered.length === 0 && (
                                <tr><td colSpan={9} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Sonuç bulunamadı...</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default Rankings;
