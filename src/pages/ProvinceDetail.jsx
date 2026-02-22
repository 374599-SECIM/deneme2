import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useData } from '../DataContext';
import { indicators, mapScoreToColor } from '../data/mockData';

const SubIndexCard = ({ title, score, prevScore, metrics, color, isOpen, onToggle }) => {
    const scoreDiff = score - prevScore;
    const isUp = scoreDiff > 0;
    const diffColor = isUp ? '#10b981' : (scoreDiff < 0 ? '#ef4444' : 'var(--text-secondary)');
    const diffSign = isUp ? '+' : '';

    return (
        <div className="glass-card" style={{ padding: '16px', marginBottom: '16px', cursor: 'pointer', transition: 'all 0.2s' }} onClick={onToggle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '8px',
                        backgroundColor: `${color}15`, color: color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold', fontSize: '14px'
                    }}>
                        {score.toFixed(1)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>{title}</h3>
                        <span style={{ fontSize: '12px', color: diffColor, fontWeight: 500, marginTop: '2px' }}>
                            {Math.abs(scoreDiff) < 0.1 ? '▬ Değişim yok' : `${isUp ? '▲' : '▼'} ${diffSign}${scoreDiff.toFixed(1)} Puan (2024'e göre)`}
                        </span>
                    </div>
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                    {isOpen ? '▲' : '▼'}
                </div>
            </div>

            {isOpen && (
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }} onClick={e => e.stopPropagation()}>
                    {metrics.map((m, idx) => {
                        const score2025 = m.history?.[2025]?.toFixed(1) || '—';
                        const score2024 = m.history?.[2024]?.toFixed(1) || '—';
                        const score2023 = m.history?.[2023]?.toFixed(1) || '—';

                        return (
                            <div key={idx} className="metric-row-hover" style={{ position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>{m.name}</span>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.score.toFixed(1)}</span>
                                </div>
                                <div className="metric-bar" style={{ height: '6px', backgroundColor: 'var(--bg-hover)' }}>
                                    <div className="metric-bar-fill" style={{ width: `${m.score}%`, backgroundColor: color, height: '100%', borderRadius: '3px' }}></div>
                                </div>
                                <div className="metric-history-tooltip">
                                    <div style={{ fontWeight: 700, marginBottom: '4px', color: '#fff' }}>Geçmiş Yıl Değerleri</div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <span>2025: <strong style={{ color: '#fff' }}>{score2025}</strong></span>
                                        <span>2024: <strong style={{ color: '#fff' }}>{score2024}</strong></span>
                                        <span>2023: <strong style={{ color: '#fff' }}>{score2023}</strong></span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const ProvinceDetail = () => {
    const { id } = useParams();
    const { provinces, globalYear } = useData();
    const navigate = useNavigate();
    const province = provinces.find(p => p.id === id);

    // State to manage open accordions (open all by default for visibility)
    const [openSections, setOpenSections] = useState({
        sectoral: true,
        rnd: true,
        digital: true,
        techOutput: true,
        lifeQuality: true
    });

    const toggleSection = (key) => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (!province) {
        return (
            <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>İl Bulunamadı</h2>
                <button onClick={() => navigate('/rankings')} style={{ color: 'var(--accent-blue)' }}>Sıralamaya Geri Dön</button>
            </div>
        );
    }

    const radarData = indicators.filter(i => i.id !== 'overall').map(ind => ({
        subject: ind.name,
        '2025': province.historyScores[2025]?.scores[ind.id] || 0,
        '2024': province.historyScores[2024]?.scores[ind.id] || 0,
        '2023': province.historyScores[2023]?.scores[ind.id] || 0,
        fullMark: 100,
    }));

    const getMetricsWithHistory = (category) => {
        const currentMetrics = province.subMetrics[category] || [];
        return currentMetrics.map(m => {
            return {
                ...m,
                history: {
                    2025: province.historyScores[2025]?.subMetrics[category]?.find(x => x.name === m.name)?.score,
                    2024: province.historyScores[2024]?.subMetrics[category]?.find(x => x.name === m.name)?.score,
                    2023: province.historyScores[2023]?.subMetrics[category]?.find(x => x.name === m.name)?.score,
                }
            };
        });
    };

    const historyData = [
        { year: '2023', rank: province.historyScores[2023]?.rank },
        { year: '2024', rank: province.historyScores[2024]?.rank },
        { year: '2025', rank: province.historyScores[2025]?.rank },
    ];

    const gradeColor = mapScoreToColor(province.grade);

    const rankDiff = province.rankPrev - province.rankCurrent; // Positive means rank improved (smaller number)
    const isRankUp = rankDiff > 0;
    const rankDiffColor = isRankUp ? '#10b981' : (rankDiff < 0 ? '#ef4444' : 'var(--text-secondary)');

    return (
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Back & Header */}
            <div>
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                    Geri Dön
                </button>
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="detail-header">
                        <div className="detail-grade-box" style={{ borderColor: gradeColor, backgroundColor: `${gradeColor}15`, color: gradeColor }}>
                            {province.grade}
                        </div>
                        <div>
                            <h2 className="detail-name">{province.name}</h2>
                            <p className="detail-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📍 Türkiye Geneli Sıralama: <strong style={{ color: 'var(--text-primary)' }}>#{province.rankCurrent}</strong></span>
                                {rankDiff !== 0 ? (
                                    <span style={{ fontSize: '13px', padding: '2px 8px', borderRadius: '12px', backgroundColor: `${rankDiffColor}20`, color: rankDiffColor, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                        {isRankUp ? '▲' : '▼'} {Math.abs(rankDiff)} Basamak
                                    </span>
                                ) : (
                                    <span style={{ fontSize: '13px', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                        ▬ Değişmedi
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                    <Link to="/compare" style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg-hover)', fontWeight: 500, transition: 'all 0.2s' }}>
                        Kıyasla
                    </Link>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {/* Top Section: Overview & Charts */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Overall score */}
                        <div className="glass-card">
                            <h3 className="section-title" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: 8 }}>Genel Puan</h3>
                            <div className="overall-score text-gradient" style={{ color: gradeColor, backgroundImage: 'none', WebkitTextFillColor: 'initial' }}>
                                {province.scores.overall.toFixed(1)}
                            </div>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8 }}>{province.description}</p>
                        </div>

                        {/* Policy card */}
                        <div className="glass-card" style={{ background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)', borderLeft: `4px solid ${gradeColor}` }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>🎯 Akıllı Uzmanlaşma Politikaları</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '14px' }}>{province.policy}</p>
                        </div>
                    </div>

                    {/* Radar Chart */}
                    <div className="glass-card" style={{ flex: 1, minHeight: 380 }}>
                        <h3 className="section-title" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: 8 }}>Alt Endeks Performansı</h3>
                        <div style={{ width: '100%', height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                    <PolarGrid stroke="#334155" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#e2e8f0', fontSize: 13 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                                    <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '13px' }} />
                                    <Radar name="2025" dataKey="2025" stroke={gradeColor} fill={gradeColor} fillOpacity={0.4} />
                                    <Radar name="2024" dataKey="2024" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.15} />
                                    <Radar name="2023" dataKey="2023" stroke="#475569" fill="#475569" fillOpacity={0.05} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Trend chart */}
                    <div className="glass-card" style={{ minHeight: 320 }}>
                        <h3 className="section-title" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: 8 }}>Sıralama Trendi (2023-2025)</h3>
                        <div style={{ width: '100%', height: 260, marginTop: '16px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={historyData} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis reversed stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} labelStyle={{ color: '#94a3b8' }} />
                                    <Line type="monotone" dataKey="rank" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, fill: '#0b1120', strokeWidth: 2 }} activeDot={{ r: 7 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Detailed Scorecard */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={gradeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        Detaylı İl Karnesi
                    </h3>

                    {/* Sektörel Yapı */}
                    <SubIndexCard
                        title="Sektörel Yapı"
                        score={province.scores.sectoral}
                        prevScore={province.prevScores.sectoral}
                        metrics={getMetricsWithHistory('sectoral')}
                        color="#a855f7" // Purple
                        isOpen={openSections.sectoral}
                        onToggle={() => toggleSection('sectoral')}
                    />

                    {/* Ar-Ge ve Yenilikçilik */}
                    <SubIndexCard
                        title="Araştırma ve Yenilikçilik Kapasitesi"
                        score={province.scores.rnd}
                        prevScore={province.prevScores.rnd}
                        metrics={getMetricsWithHistory('rnd')}
                        color="#3b82f6" // Blue
                        isOpen={openSections.rnd}
                        onToggle={() => toggleSection('rnd')}
                    />

                    {/* Dijital Altyapı */}
                    <SubIndexCard
                        title="Dijital Altyapı"
                        score={province.scores.digital}
                        prevScore={province.prevScores.digital}
                        metrics={getMetricsWithHistory('digital')}
                        color="#0ea5e9" // Light Blue
                        isOpen={openSections.digital}
                        onToggle={() => toggleSection('digital')}
                    />

                    {/* Teknoloji Çıktıları */}
                    <SubIndexCard
                        title="Teknoloji Çıktıları"
                        score={province.scores.techOutput}
                        prevScore={province.prevScores.techOutput}
                        metrics={getMetricsWithHistory('techOutput')}
                        color="#10b981" // Green
                        isOpen={openSections.techOutput}
                        onToggle={() => toggleSection('techOutput')}
                    />

                    {/* Yaşam Kalitesi */}
                    <SubIndexCard
                        title="Yaşam Kalitesi ve İş Gücü Çekiciliği"
                        score={province.scores.lifeQuality}
                        prevScore={province.prevScores.lifeQuality}
                        metrics={getMetricsWithHistory('lifeQuality')}
                        color="#f59e0b" // Orange
                        isOpen={openSections.lifeQuality}
                        onToggle={() => toggleSection('lifeQuality')}
                    />

                </div>
            </div>

        </div>
    );
};

export default ProvinceDetail;
