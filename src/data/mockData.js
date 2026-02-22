// src/data/mockData.js — 81 provinces with ISO 3166-2:TR IDs and detailed sub-metrics

export const indicators = [
    { id: 'overall', name: 'Genel Sıralama' },
    { id: 'sectoral', name: 'Sektörel Yapı' },
    { id: 'rnd', name: 'Ar-Ge ve Yenilikçilik' },
    { id: 'digital', name: 'Dijital Altyapı' },
    { id: 'techOutput', name: 'Teknoloji Çıktıları' },
    { id: 'lifeQuality', name: 'Yaşam Kalitesi' },
];

export const subIndicatorsInfo = {
    sectoral: [
        { id: 'sec_1', name: 'İmalat Sanayi Yüksek Teknoloji Yoğunluğu' },
        { id: 'sec_2', name: 'Hizmetler Sektörü Bilgi Yoğunluğu' }
    ],
    rnd: [
        { id: 'rnd_1', name: 'Ar-Ge Merkezi Yoğunluğu' },
        { id: 'rnd_2', name: 'Tasarım Merkezi Ortalaması' },
        { id: 'rnd_3', name: 'Akademik Eser Sayısı Katsayısı' },
        { id: 'rnd_4', name: 'Üniversite Sanayi İş Birliği' },
        { id: 'rnd_5', name: 'TÜBİTAK Destekleri Alım Oranı' },
        { id: 'rnd_6', name: 'Girişimcilik Ekosistemi Derinliği' },
        { id: 'rnd_7', name: 'KOSGEB İnovasyon Destekleri' },
        { id: 'rnd_8', name: 'Ar-Ge Personeli İstihdamı' },
        { id: 'rnd_9', name: 'Teknopark Firma Sayısı Yoğunluğu' },
        { id: 'rnd_10', name: 'Yüksek Lisans/Doktora Mezun Oranı' }
    ],
    digital: [
        { id: 'dig_1', name: 'Genişbant İnternet Abone Yoğunluğu' },
        { id: 'dig_2', name: 'Fiber Altyapı Yaygınlığı' },
        { id: 'dig_3', name: '4.5G / Mobil İnternet Tüketimi' },
        { id: 'dig_4', name: 'E-Devlet Bireysel Kullanım Oranı' }
    ],
    techOutput: [
        { id: 'out_1', name: 'Patent ve Faydalı Model Tescilleri' },
        { id: 'out_2', name: 'Marka ve Endüstriyel Tasarım Tescili' },
        { id: 'out_3', name: 'Yüksek Teknolojili Ürün İhracatı' },
        { id: 'out_4', name: 'Orta-Yüksek Teknolojili Ürün İhracatı' }
    ],
    lifeQuality: [
        { id: 'life_1', name: 'İstihdam ve İşgücüne Katılım Oranı' },
        { id: 'life_2', name: 'Nitelikli İşgücü Çekiciliği' },
        { id: 'life_3', name: 'Sosyalleşme ve Tiyatro/Sinema Olanakları' },
        { id: 'life_4', name: 'Yeşil Alan ve Doğal Çevre Kalitesi' },
        { id: 'life_5', name: 'Sağlık Hizmetlerine Erişim ve Kalite' },
        { id: 'life_6', name: 'Eğitim Hizmetlerine Erişim (K12/Üniversite)' },
        { id: 'life_7', name: 'Kültürel Tolerans ve Çeşitlilik' },
        { id: 'life_8', name: 'Suç Oranının Düşüklüğü (Güvenlik)' },
        { id: 'life_9', name: 'Ulaşım Altyapısı ve Havalimanı Erişimi' },
        { id: 'life_10', name: 'Mesleki Eğitim ve Yaşam Boyu Öğrenme' },
        { id: 'life_11', name: 'Konut Kalitesi ve Barınma Olanakları' },
        { id: 'life_12', name: 'Ortalama Yaşam Süresi Beklentisi' },
        { id: 'life_13', name: 'Bebek Ölümleri Düşüklüğü' },
        { id: 'life_14', name: 'Hava Kalitesi İndeksi' },
        { id: 'life_15', name: 'Geniş İnternet Erişiminden Memnuniyet' },
        { id: 'life_16', name: 'Genel Yaşam Memnuniyeti Endeksi' }
    ]
};

// Helper: generate semi-random but deterministic scores
function genScores(overall, seed) {
    const s = (base, offset) => Math.max(5, Math.min(100, base + (((seed * offset) % 20) - 10)));
    return {
        overall,
        sectoral: s(overall, 7),
        rnd: s(overall, 13),
        digital: s(overall, 19),
        techOutput: s(overall, 23),
        lifeQuality: s(overall, 31),
    };
}

function genPrevScores(currentScores, seed) {
    const diff = (val, mod) => Math.max(0, Math.min(100, val + (((seed * mod) % 10) - 5) * 0.6));
    return {
        overall: diff(currentScores.overall, 3),
        sectoral: diff(currentScores.sectoral, 5),
        rnd: diff(currentScores.rnd, 7),
        digital: diff(currentScores.digital, 11),
        techOutput: diff(currentScores.techOutput, 13),
        lifeQuality: diff(currentScores.lifeQuality, 17),
    };
}

// Generate sub-metric scores based on main score
function genSubMetrics(mainScores, seed) {
    const s = (base, offset) => Math.max(0, Math.min(100, base + (((seed * offset * 3) % 40) - 20)));
    const metrics = {};

    // Sectoral (2)
    metrics.sectoral = subIndicatorsInfo.sectoral.map((ind, i) => ({ ...ind, score: s(mainScores.sectoral, i + 1) }));
    // R&D (10)
    metrics.rnd = subIndicatorsInfo.rnd.map((ind, i) => ({ ...ind, score: s(mainScores.rnd, i + 1) }));
    // Digital (4)
    metrics.digital = subIndicatorsInfo.digital.map((ind, i) => ({ ...ind, score: s(mainScores.digital, i + 1) }));
    // Tech Output (4)
    metrics.techOutput = subIndicatorsInfo.techOutput.map((ind, i) => ({ ...ind, score: s(mainScores.techOutput, i + 1) }));
    // Life Quality (16)
    metrics.lifeQuality = subIndicatorsInfo.lifeQuality.map((ind, i) => ({ ...ind, score: s(mainScores.lifeQuality, i + 1) }));

    return metrics;
}

// Name mapping for Turkish province names
const trNames = {
    TR01: 'Adana', TR02: 'Adıyaman', TR03: 'Afyonkarahisar', TR04: 'Ağrı', TR05: 'Amasya',
    TR06: 'Ankara', TR07: 'Antalya', TR08: 'Artvin', TR09: 'Aydın', TR10: 'Balıkesir',
    TR11: 'Bilecik', TR12: 'Bingöl', TR13: 'Bitlis', TR14: 'Bolu', TR15: 'Burdur',
    TR16: 'Bursa', TR17: 'Çanakkale', TR18: 'Çankırı', TR19: 'Çorum', TR20: 'Denizli',
    TR21: 'Diyarbakır', TR22: 'Edirne', TR23: 'Elazığ', TR24: 'Erzincan', TR25: 'Erzurum',
    TR26: 'Eskişehir', TR27: 'Gaziantep', TR28: 'Giresun', TR29: 'Gümüşhane', TR30: 'Hakkari',
    TR31: 'Hatay', TR32: 'Isparta', TR33: 'Mersin', TR34: 'İstanbul', TR35: 'İzmir',
    TR36: 'Kars', TR37: 'Kastamonu', TR38: 'Kayseri', TR39: 'Kırklareli', TR40: 'Kırşehir',
    TR41: 'Kocaeli', TR42: 'Konya', TR43: 'Kütahya', TR44: 'Malatya', TR45: 'Manisa',
    TR46: 'Kahramanmaraş', TR47: 'Mardin', TR48: 'Muğla', TR49: 'Muş', TR50: 'Nevşehir',
    TR51: 'Niğde', TR52: 'Ordu', TR53: 'Rize', TR54: 'Sakarya', TR55: 'Samsun',
    TR56: 'Siirt', TR57: 'Sinop', TR58: 'Sivas', TR59: 'Tekirdağ', TR60: 'Tokat',
    TR61: 'Trabzon', TR62: 'Tunceli', TR63: 'Şanlıurfa', TR64: 'Uşak', TR65: 'Van',
    TR66: 'Yozgat', TR67: 'Zonguldak', TR68: 'Aksaray', TR69: 'Bayburt', TR70: 'Karaman',
    TR71: 'Kırıkkale', TR72: 'Batman', TR73: 'Şırnak', TR74: 'Bartın', TR75: 'Ardahan',
    TR76: 'Iğdır', TR77: 'Yalova', TR78: 'Karabük', TR79: 'Kilis', TR80: 'Osmaniye', TR81: 'Düzce',
};

// Rank/grade/score data for key provinces
const keyProvinces = {
    TR06: { rank: 1, prev: 1, grade: 'AA', overall: 85.4, scores: { overall: 85.4, sectoral: 82.1, rnd: 95.0, digital: 88.5, techOutput: 91.2, lifeQuality: 70.2 }, policy: 'İnovasyonun kalbi Başkent\'te atıyor: patentte lider.', desc: 'Ankara, patent çıktılarıyla üst sıralarda konumlanıyor. Güçlü üniversite ve savunma sanayii altyapısı genel endeks liderliğini pekiştiriyor.' },
    TR34: { rank: 2, prev: 2, grade: 'AA', overall: 83.2, scores: { overall: 83.2, sectoral: 80.5, rnd: 85.0, digital: 92.5, techOutput: 88.0, lifeQuality: 65.0 }, policy: 'Üniversite ve araştırma kuruluşları çok olmasına rağmen, Ar-Ge faaliyetleri sektörel olarak dağınık.', desc: 'Büyük ölçek avantajına rağmen dağınık yapı Ar-Ge verimliliğini düşürüyor.' },
    TR26: { rank: 3, prev: 3, grade: 'BA', overall: 78.5, scores: { overall: 78.5, sectoral: 85.0, rnd: 80.5, digital: 75.0, techOutput: 82.0, lifeQuality: 70.0 }, policy: 'Uzmanlaşmış mühendislik alanlarıyla yüksek katma değerli teknoloji üretiminde ön sıralarda.', desc: 'Sınırlı ölçekte ancak uzmanlaşmaya dayalı yenilikçi üretim.' },
    TR41: { rank: 4, prev: 4, grade: 'BA', overall: 76.0, scores: { overall: 76.0, sectoral: 88.0, rnd: 89.0, digital: 70.5, techOutput: 75.0, lifeQuality: 58.0 }, policy: 'TÜBİTAK MAM, Bilişim Vadisi ve güçlü sanayi altyapısıyla Ar-Ge merkezlerinde belirgin öne çıkıyor.', desc: 'Dijital ve Yeşil Dönüşüm programlarının merkez üssü.' },
    TR35: { rank: 5, prev: 5, grade: 'BA', overall: 75.2, scores: { overall: 75.2, sectoral: 72.0, rnd: 75.0, digital: 78.0, techOutput: 70.0, lifeQuality: 82.0 }, policy: 'Akademik ve araştırma altyapısıyla ön plana çıkıyor.', desc: 'Yaşam kalitesi ve Ar-Ge kapasitesi ile dengeli bir profil sergiliyor.' },
    TR38: { rank: 6, prev: 8, grade: 'BB', overall: 68.5, scores: { overall: 68.5, sectoral: 75.0, rnd: 65.0, digital: 62.0, techOutput: 85.0, lifeQuality: 55.0 }, policy: 'Markalaşma ve Ticarileşme Desteği önceliklidir.', desc: 'Teknoloji çıktılarında zirveye yükselmesi.' },
    TR16: { rank: 7, prev: 7, grade: 'BB', overall: 67.8, scores: { overall: 67.8, sectoral: 80.0, rnd: 72.0, digital: 65.0, techOutput: 83.0, lifeQuality: 60.0 }, policy: 'Sanayi temelli inovasyonla öne çıkıyor.', desc: 'Tasarım ve faydalı model tescillerindeki güçlü performans.' },
    TR54: { rank: 8, prev: 9, grade: 'BB', overall: 65.4, scores: { overall: 65.4, sectoral: 70.0, rnd: 60.0, digital: 58.0, techOutput: 72.0, lifeQuality: 68.0 }, policy: 'Bölgesel Odaklı Akıllı Uzmanlaşma.', desc: 'Otomotiv ve savunma sanayii etkileşimi yüksek.' },
    TR27: { rank: 9, prev: 10, grade: 'BB', overall: 64.0, scores: { overall: 64.0, sectoral: 70.0, rnd: 58.0, digital: 55.0, techOutput: 78.0, lifeQuality: 59.0 }, policy: 'Sınai mülkiyet ve ihracat odaklı büyüme.', desc: 'Güçlü sanayi yapısıyla bölgenin lokomotifi.' },
    TR07: { rank: 10, prev: 11, grade: 'BB', overall: 63.0, scores: { overall: 63.0, sectoral: 55.0, rnd: 50.0, digital: 72.0, techOutput: 45.0, lifeQuality: 93.0 }, policy: 'Turizm ve teknoloji entegrasyonu.', desc: 'Yaşam kalitesinde zirveye yakın, Ar-Ge\'de gelişim potansiyeli yüksek.' },
    TR42: { rank: 11, prev: 12, grade: 'BB', overall: 62.5, scores: { overall: 62.5, sectoral: 73.0, rnd: 55.0, digital: 60.0, techOutput: 70.0, lifeQuality: 55.0 }, policy: 'Tarım ve sanayide ikili dönüşüm.', desc: 'Güçlü sanayi altyapısı ve tarım kapasitesi.' },
    TR59: { rank: 12, prev: 13, grade: 'BB', overall: 61.0, scores: { overall: 61.0, sectoral: 68.0, rnd: 55.0, digital: 65.0, techOutput: 60.0, lifeQuality: 57.0 }, policy: 'Lojistik ve sanayi entegrasyonu.', desc: 'İstanbul yakınlığı avantajıyla hızla büyüyen sanayi.' },
    TR51: { rank: 22, prev: 56, grade: 'CB', overall: 45.0, scores: { overall: 45.0, sectoral: 40.0, rnd: 55.0, digital: 42.0, techOutput: 38.0, lifeQuality: 50.0 }, policy: 'Asimetrik Yükselen Yıldız', desc: 'Girişimcilik desteği alan firma sayısı ve destek miktarıyla üst sıralara zıplayan il (34 basamak yükseliş).' },
    TR76: { rank: 40, prev: 70, grade: 'CC', overall: 35.0, scores: { overall: 35.0, sectoral: 30.0, rnd: 40.0, digital: 35.0, techOutput: 25.0, lifeQuality: 45.0 }, policy: 'Hızlı Gelişen Ekosistem', desc: '30 basamak birden yükselerek en dikkat çeken illerden biri oldu.' },
    TR73: { rank: 81, prev: 81, grade: 'FF', overall: 12.0, scores: { overall: 12.0, sectoral: 15.0, rnd: 8.0, digital: 10.0, techOutput: 5.0, lifeQuality: 20.0 }, policy: 'Yapısal Dönüşüm İhtiyacı', desc: 'Endekste son sırada; acil altyapı ve yetenek yatırımlarına ihtiyaç duyuyor.' },
};

// Grade thresholds
function getGrade(score) {
    if (score >= 80) return 'AA';
    if (score >= 70) return 'BA';
    if (score >= 60) return 'BB';
    if (score >= 50) return 'CB';
    if (score >= 40) return 'CC';
    if (score >= 30) return 'DC';
    if (score >= 20) return 'DD';
    return 'FF';
}

// Build all 81 provinces
const allIds = Object.keys(trNames);
let usedRanks = new Set(Object.values(keyProvinces).map(p => p.rank));
let nextRank = 1;

export const provincesData = allIds.map(id => {
    const seed = parseInt(id.slice(2));
    const key = keyProvinces[id];

    let rank2025, grade2025, scores2025, policy, description;

    if (key) {
        rank2025 = key.rank;
        grade2025 = key.grade;
        scores2025 = key.scores;
        policy = key.policy;
        description = key.desc;
    } else {
        while (usedRanks.has(nextRank)) nextRank++;
        rank2025 = nextRank++;
        usedRanks.add(rank2025);
        const overall = Math.max(10, Math.round(82 - (rank2025 * 0.9) + ((seed * 7) % 6)));
        grade2025 = getGrade(overall);
        scores2025 = genScores(overall, seed);
        policy = 'Bölgesel Kalkınma ve Teknoloji Yatırımları';
        description = `${trNames[id]} ili, araştırma ve yenilik kapasitesini artırma hedefine sahiptir.`;
    }

    const subMetrics2025 = genSubMetrics(scores2025, seed);

    // 2024 Data
    const scores2024 = genPrevScores(scores2025, seed);
    const subMetrics2024 = genSubMetrics(scores2024, seed + 1);
    const grade2024 = getGrade(scores2024.overall);
    const rank2024 = key ? key.prev : rank2025 + Math.floor(((seed * 13) % 10) - 5);

    // 2023 Data
    const scores2023 = genPrevScores(scores2024, seed + 2);
    const subMetrics2023 = genSubMetrics(scores2023, seed + 3);
    const grade2023 = getGrade(scores2023.overall);
    const rank2023 = rank2024 + Math.floor(((seed * 17) % 10) - 5);

    return {
        id,
        name: trNames[id],
        policy,
        description,
        history: {
            2025: { scores: scores2025, subMetrics: subMetrics2025, rank: rank2025, grade: grade2025 },
            2024: { scores: scores2024, subMetrics: subMetrics2024, rank: rank2024, grade: grade2024 },
            2023: { scores: scores2023, subMetrics: subMetrics2023, rank: rank2023, grade: grade2023 }
        }
    };
});

// Re-assign strict 1-81 ranks for each year based on generated scores
[2025, 2024, 2023].forEach(year => {
    provincesData.sort((a, b) => b.history[year].scores.overall - a.history[year].scores.overall);
    provincesData.forEach((p, i) => { p.history[year].rank = i + 1; });
});

export const getProvinceById = (id, year = 2025) => {
    const p = provincesData.find(prov => prov.id === id);
    if (!p) return null;
    const currentData = p.history[year];
    const prevData = p.history[year - 1] || p.history[year];
    return {
        id: p.id,
        name: p.name,
        policy: p.policy,
        description: p.description,
        rankCurrent: currentData.rank,
        rankPrev: prevData.rank,
        grade: currentData.grade,
        scores: currentData.scores,
        prevScores: prevData.scores,
        subMetrics: currentData.subMetrics,
        historyScores: p.history
    };
};

export const mapScoreToColor = (grade) => {
    const colors = {
        'AA': '#3b82f6',
        'BA': '#60a5fa',
        'BB': '#93c5fd',
        'CB': '#fcd34d',
        'CC': '#fbbf24',
        'DC': '#f59e0b',
        'DD': '#d97706',
        'FF': '#ef4444',
    };
    return colors[grade] || '#475569';
};
