export type StatKey = 'STR' | 'INT' | 'VIT' | 'WIS' | 'CRE' | 'LCK' | 'CHA'
export type OptionKey = 'A' | 'B' | 'C' | 'D'
export type Stats = Record<StatKey, number>

export interface QuestionOption {
  text: string
  stats: Partial<Stats>
}

export interface Question {
  id: number
  question: string
  options: Record<OptionKey, QuestionOption>
}

export interface Role {
  name: string
  icon: string
  primaryStat: StatKey
  description: string
}

export const STAT_KEYS: StatKey[] = ['STR', 'INT', 'VIT', 'WIS', 'CRE', 'LCK', 'CHA']

export const OPTION_KEYS: OptionKey[] = ['A', 'B', 'C', 'D']

export const STAT_LABELS: Record<StatKey, string> = {
  STR: 'Strength',
  INT: 'Intelligence',
  VIT: 'Vitality',
  WIS: 'Wisdom',
  CRE: 'Creativity',
  LCK: 'Luck',
  CHA: 'Charisma',
}

export const STAT_COLORS: Record<StatKey, string> = {
  STR: 'var(--rank-a)',
  INT: 'var(--rank-d)',
  VIT: 'var(--rank-e)',
  WIS: 'var(--rank-c)',
  CRE: 'var(--rank-sp)',
  LCK: 'var(--rank-s)',
  CHA: 'var(--rank-b)',
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Hari libur tiba. Kamu paling sering menghabiskan waktu dengan...',
    options: {
      A: { text: 'Olahraga atau aktivitas fisik di luar', stats: { STR: 3, VIT: 2 } },
      B: { text: 'Baca buku atau belajar hal baru', stats: { INT: 3, WIS: 2 } },
      C: { text: 'Bikin sesuatu — gambar, musik, tulisan', stats: { CRE: 3, LCK: 1 } },
      D: { text: 'Ngobrol atau kumpul sama orang-orang', stats: { CHA: 3, WIS: 1 } },
    },
  },
  {
    id: 2,
    question: 'Kalau ada proyek besar, kamu biasanya...',
    options: {
      A: { text: 'Langsung eksekusi, figuring out sambil jalan', stats: { STR: 2, VIT: 2, LCK: 1 } },
      B: { text: 'Riset dulu sampai paham betul sebelum mulai', stats: { INT: 3, WIS: 2 } },
      C: { text: 'Nyari angle unik yang orang lain belum kepikiran', stats: { CRE: 3, INT: 1 } },
      D: { text: 'Ngajak orang lain buat kolaborasi', stats: { CHA: 3, WIS: 1 } },
    },
  },
  {
    id: 3,
    question: 'Kamu lagi down dan capek banget. Yang paling membantu adalah...',
    options: {
      A: { text: 'Olahraga atau gerak badan — langsung seger', stats: { VIT: 3, STR: 2 } },
      B: { text: 'Sendirian, baca atau dengerin podcast', stats: { WIS: 3, INT: 1 } },
      C: { text: 'Nuangin perasaan lewat seni atau tulisan', stats: { CRE: 3, WIS: 1 } },
      D: { text: 'Cerita ke teman dekat atau keluarga', stats: { CHA: 3, WIS: 1 } },
    },
  },
  {
    id: 4,
    question: 'Dalam satu minggu, kamu paling konsisten melakukan...',
    options: {
      A: { text: 'Aktivitas fisik (gym, lari, olahraga)', stats: { STR: 3, VIT: 2 } },
      B: { text: 'Belajar atau membaca minimal 30 menit', stats: { INT: 3, WIS: 1 } },
      C: { text: 'Bikin atau berkreasi sesuatu', stats: { CRE: 3, LCK: 1 } },
      D: { text: 'Workout sosial — networking, ngobrol, meeting', stats: { CHA: 3, STR: 1 } },
    },
  },
  {
    id: 5,
    question: 'Teman-teman biasanya mengenal kamu sebagai...',
    options: {
      A: { text: 'Yang paling gigih dan ga gampang nyerah', stats: { STR: 2, VIT: 2, WIS: 1 } },
      B: { text: 'Yang paling banyak tahu dan analitis', stats: { INT: 3, WIS: 2 } },
      C: { text: 'Yang paling kreatif dan out-of-the-box', stats: { CRE: 3, LCK: 1 } },
      D: { text: 'Yang paling mudah diajak bicara dan bisa dipercaya', stats: { CHA: 3, WIS: 1 } },
    },
  },
  {
    id: 6,
    question: 'Kalau kamu bisa instan jago satu hal, kamu pilih...',
    options: {
      A: { text: 'Kekuatan fisik dan stamina luar biasa', stats: { STR: 3, VIT: 2 } },
      B: { text: 'Ingatan sempurna dan bisa belajar ultra-cepat', stats: { INT: 3, WIS: 2 } },
      C: { text: 'Bisa bikin karya seni atau musik level maestro', stats: { CRE: 3, LCK: 1 } },
      D: { text: 'Selalu beruntung di waktu yang tepat', stats: { LCK: 3, CHA: 2 } },
    },
  },
  {
    id: 7,
    question: 'Sebelum tidur, kamu biasanya...',
    options: {
      A: { text: 'Langsung tidur — badan udah capek dari aktivitas', stats: { VIT: 2, STR: 2 } },
      B: { text: 'Refleksi hari ini, nulis jurnal atau to-do besok', stats: { WIS: 3, INT: 2 } },
      C: { text: 'Dengerin musik, nonton, atau scroll konten kreatif', stats: { CRE: 3, LCK: 1 } },
      D: { text: 'Balas pesan atau update teman-teman soal hari ini', stats: { CHA: 3, WIS: 1 } },
    },
  },
  {
    id: 8,
    question: 'Kalau harus pilih satu kata yang paling menggambarkan dirimu...',
    options: {
      A: { text: 'Tangguh', stats: { STR: 2, VIT: 3 } },
      B: { text: 'Cerdas', stats: { INT: 3, WIS: 2 } },
      C: { text: 'Imajinatif', stats: { CRE: 3, LCK: 2 } },
      D: { text: 'Karismatik', stats: { CHA: 3, STR: 1 } },
    },
  },
  {
    id: 9,
    question: 'Dalam menghadapi masalah besar, kamu pertama kali...',
    options: {
      A: { text: 'Langsung action — coba satu per satu sampai ketemu solusi', stats: { STR: 3, LCK: 1 } },
      B: { text: 'Analisis akar masalah dulu secara sistematis', stats: { INT: 3, WIS: 2 } },
      C: { text: 'Cari solusi yang unconventional atau kreatif', stats: { CRE: 3, INT: 1 } },
      D: { text: 'Minta perspektif dari orang lain yang dipercaya', stats: { CHA: 3, WIS: 2 } },
    },
  },
  {
    id: 10,
    question: 'Target terbesar kamu dalam 1 tahun ke depan adalah...',
    options: {
      A: { text: 'Fisik lebih sehat — olahraga rutin, badan ideal', stats: { STR: 2, VIT: 3 } },
      B: { text: 'Skill atau pengetahuan baru yang level up karier', stats: { INT: 3, WIS: 2 } },
      C: { text: 'Proyek kreatif yang selama ini cuma di kepala', stats: { CRE: 3, LCK: 1 } },
      D: { text: 'Relasi dan circle yang lebih berkualitas', stats: { CHA: 3, WIS: 1 } },
    },
  },
]

export const ROLES: Role[] = [
  { name: 'Warrior', icon: '⚔️', primaryStat: 'STR', description: 'Pejuang fisik — kuat, tahan banting, pantang menyerah.' },
  { name: 'Scholar', icon: '📚', primaryStat: 'INT', description: 'Pencari ilmu — cerdas, analitis, selalu ingin tahu.' },
  { name: 'Artisan', icon: '🎨', primaryStat: 'CRE', description: 'Jiwa kreatif — inovatif, ekspresif, unik.' },
  { name: 'Guardian', icon: '🛡️', primaryStat: 'VIT', description: 'Pelindung — sehat, stabil, jadi andalan orang sekitar.' },
  { name: 'Sage', icon: '🔮', primaryStat: 'WIS', description: 'Bijaksana — reflektif, tenang, visioner.' },
  { name: 'Trickster', icon: '🎲', primaryStat: 'LCK', description: 'Si beruntung — adaptif, cerdik, penuh kejutan.' },
  { name: 'Commander', icon: '👑', primaryStat: 'CHA', description: 'Pemimpin — karismatik, tegas, menginspirasi.' },
]

export function emptyStats(): Stats {
  return { STR: 0, INT: 0, VIT: 0, WIS: 0, CRE: 0, LCK: 0, CHA: 0 }
}

/** Sums the stat points granted by each chosen answer across all questions. */
export function calculateStats(answers: Record<number, OptionKey>): Stats {
  const totals = emptyStats()
  for (const q of QUESTIONS) {
    const choice = answers[q.id]
    if (!choice) continue
    const gained = q.options[choice].stats
    for (const key of STAT_KEYS) {
      totals[key] += gained[key] ?? 0
    }
  }
  return totals
}

/** Picks the role whose primary stat scored highest. Ties resolve to ROLES order. */
export function suggestRole(stats: Stats): Role {
  let best = ROLES[0]
  for (const role of ROLES) {
    if (stats[role.primaryStat] > stats[best.primaryStat]) {
      best = role
    }
  }
  return best
}
