import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { turkeyPaths, VIEWBOX } from '../data/turkeyPaths';
import { useData } from '../DataContext';
import { mapScoreToColor } from '../data/mockData';

const TurkeyMap = ({ activeIndex }) => {
    const { provinces } = useData();
    const navigate = useNavigate();
    const [hoveredId, setHoveredId] = useState(null);
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, name: '', score: 0, grade: '' });

    // Map province id to score/grade
    const provinceMap = useMemo(() => {
        const map = {};
        provinces.forEach(p => { map[p.id] = p; });
        return map;
    }, [provinces]);

    const handleMouseEnter = (e, pathData) => {
        const prov = provinceMap[pathData.id];
        if (!prov) return;
        const rect = e.currentTarget.closest('svg').getBoundingClientRect();
        setHoveredId(pathData.id);
        setTooltip({
            show: true,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top - 60,
            name: prov.name,
            score: prov.scores[activeIndex]?.toFixed(1) || '—',
            grade: prov.grade,
            rank: prov.rankCurrent,
        });
    };

    const handleMouseMove = (e) => {
        if (!tooltip.show) return;
        const rect = e.currentTarget.closest('svg').getBoundingClientRect();
        setTooltip(prev => ({
            ...prev,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top - 60,
        }));
    };

    const handleMouseLeave = () => {
        setHoveredId(null);
        setTooltip({ show: false, x: 0, y: 0, name: '', score: 0, grade: '' });
    };

    const handleClick = (pathData) => {
        navigate(`/province/${pathData.id}`);
    };

    return (
        <div style={{ position: 'relative' }}>
            <svg
                viewBox={VIEWBOX}
                style={{ width: '100%', height: 'auto', overflow: 'visible' }}
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <filter id="glow">
                        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.5" />
                    </filter>
                </defs>

                {turkeyPaths.map(pathData => {
                    const prov = provinceMap[pathData.id];
                    const grade = prov?.grade || 'DD';
                    const score = prov?.scores[activeIndex] || 0;
                    const baseColor = mapScoreToColor(grade);
                    const isHovered = hoveredId === pathData.id;

                    // Score-based opacity: higher score = more opaque
                    const opacity = 0.4 + (score / 100) * 0.6;

                    return (
                        <path
                            key={pathData.id}
                            d={pathData.d}
                            fill={baseColor}
                            fillOpacity={isHovered ? 1 : opacity}
                            stroke={isHovered ? '#ffffff' : 'rgba(255,255,255,0.25)'}
                            strokeWidth={isHovered ? 1.5 : 0.5}
                            style={{
                                cursor: 'pointer',
                                transition: 'fill-opacity 0.2s, stroke-width 0.2s, stroke 0.2s',
                                filter: isHovered ? 'url(#glow)' : 'none',
                            }}
                            onMouseEnter={(e) => handleMouseEnter(e, pathData)}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleClick(pathData)}
                        />
                    );
                })}
            </svg>

            {/* Tooltip */}
            {tooltip.show && (
                <div
                    style={{
                        position: 'absolute',
                        left: tooltip.x,
                        top: tooltip.y,
                        transform: 'translateX(-50%)',
                        background: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        padding: '10px 16px',
                        pointerEvents: 'none',
                        zIndex: 100,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px' }}>{tooltip.name}</span>
                        <span
                            style={{
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 700,
                                backgroundColor: `${mapScoreToColor(tooltip.grade)}30`,
                                color: mapScoreToColor(tooltip.grade),
                            }}
                        >
                            {tooltip.grade}
                        </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', display: 'flex', gap: '12px' }}>
                        <span>Puan: <strong style={{ color: '#e2e8f0' }}>{tooltip.score}</strong></span>
                        <span>Sıra: <strong style={{ color: '#e2e8f0' }}>#{tooltip.rank}</strong></span>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="map-legend" style={{ position: 'absolute', bottom: '8px', left: '8px' }}>
                {['AA', 'BA', 'BB', 'CB', 'CC', 'FF'].map(grade => (
                    <div key={grade} className="legend-item">
                        <div className="legend-dot" style={{ backgroundColor: mapScoreToColor(grade) }}></div>
                        <span>{grade}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TurkeyMap;
