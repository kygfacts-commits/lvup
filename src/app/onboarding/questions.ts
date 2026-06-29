export type StatKey = 'STR' | 'INT' | 'VIT' | 'WIS' | 'CRE' | 'LCK' | 'CHA'
export type OptionKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
export type Stats = Record<StatKey, number>

export type Option = {
  text: string
  points: number
  stats: Partial<Record<StatKey, number>>
}

export type Question = {
  id: number
  question: string
  options: Record<OptionKey, Option>
}

export interface Role {
  name: string
  icon: string
  primaryStat: StatKey
  description: string
}

export const STAT_KEYS: StatKey[] = ['STR', 'INT', 'VIT', 'WIS', 'CRE', 'LCK', 'CHA']

export const OPTION_KEYS: OptionKey[] = ['A', 'B', 'C', 'D', 'E', 'F']

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
    question: 'Ketika kamu membuat rencana untuk dirimu sendiri, apa yang paling sering terjadi?',
    options: {
      A: { text: 'Aku mulai dengan semangat tapi jarang sampai selesai', points: 0, stats: { STR: 1 } },
      B: { text: 'Aku hampir selalu menyelesaikannya. Komitmen ke diri sendiri adalah harga mati', points: 4, stats: { WIS: 3, STR: 2 } },
      C: { text: 'Aku bahkan jarang membuat rencana, apalagi menyelesaikannya', points: -1, stats: {} },
      D: { text: 'Tergantung mood. Kadang selesai, kadang tidak', points: 2, stats: { WIS: 1, STR: 1 } },
      E: { text: 'Lebih sering selesai daripada tidak, meski butuh usaha ekstra', points: 3, stats: { WIS: 2, STR: 2 } },
      F: { text: 'Aku mudah menyerah begitu terasa berat', points: 1, stats: { STR: 1 } },
    },
  },
  {
    id: 2,
    question: 'Kamu baru gagal di sesuatu yang penting. Apa yang paling sering kamu lakukan setelahnya?',
    options: {
      A: { text: 'Analisis apa yang salah, ambil pelajaran, coba lagi dengan cara berbeda', points: 4, stats: { WIS: 3, INT: 2 } },
      B: { text: 'Kegagalan membuatku berhenti total dan sulit memulai lagi', points: -1, stats: {} },
      C: { text: 'Menyalahkan faktor luar — situasi, orang lain, atau nasib', points: 1, stats: { CHA: 1 } },
      D: { text: 'Kecewa sesaat, tapi akhirnya bangkit dan lanjut', points: 3, stats: { WIS: 2, CHA: 1 } },
      E: { text: 'Menghindari hal itu sepenuhnya agar tidak gagal lagi', points: 0, stats: {} },
      F: { text: 'Butuh waktu lama untuk memproses, tapi akhirnya move on', points: 2, stats: { WIS: 2 } },
    },
  },
  {
    id: 3,
    question: 'Kalau kamu jujur, bagaimana kondisi fisikmu dalam 3 bulan terakhir?',
    options: {
      A: { text: 'Sering lelah, sering sakit, pola hidup kacau', points: 0, stats: { VIT: 1 } },
      B: { text: 'Tidak buruk, tapi tidak ada upaya aktif untuk menjaganya', points: 2, stats: { VIT: 1, STR: 1 } },
      C: { text: 'Tidur teratur, makan bergizi, olahraga rutin', points: 4, stats: { VIT: 3, STR: 2 } },
      D: { text: 'Sengaja mengabaikan tubuh — begadang ekstrem, tidak pernah olahraga', points: -1, stats: {} },
      E: { text: 'Cukup baik — olahraga sesekali dan berusaha makan sehat', points: 3, stats: { VIT: 2, STR: 2 } },
      F: { text: 'Tahu kebiasaanku buruk tapi sulit berubah', points: 1, stats: { WIS: 1 } },
    },
  },
  {
    id: 4,
    question: 'Kapan terakhir kali kamu secara aktif belajar sesuatu yang baru — bukan karena terpaksa?',
    options: {
      A: { text: 'Beberapa bulan lalu. Kadang terdorong, kadang tidak', points: 2, stats: { INT: 1, WIS: 1 } },
      B: { text: 'Aku merasa tidak perlu berkembang, atau sudah menyerah untuk mencoba', points: -1, stats: {} },
      C: { text: 'Minggu ini. Belajar adalah bagian dari rutinitasku', points: 4, stats: { INT: 3, WIS: 2 } },
      D: { text: 'Sudah lama sekali. Tahu harus belajar tapi selalu ditunda', points: 1, stats: { INT: 1 } },
      E: { text: 'Bulan ini. Aku berusaha terus berkembang meski tidak selalu konsisten', points: 3, stats: { INT: 2, WIS: 1 } },
      F: { text: 'Rutinitas harianku hampir tidak berubah selama bertahun-tahun', points: 0, stats: {} },
    },
  },
  {
    id: 5,
    question: 'Seberapa dalam kamu mengenal dirimu sendiri — kekuatan, kelemahan, dan pola perilakumu?',
    options: {
      A: { text: 'Aku menghindari introspeksi — terlalu menyakitkan atau tidak berguna', points: -1, stats: {} },
      B: { text: 'Lumayan. Aku sadar beberapa hal tapi banyak yang belum kujelajahi', points: 2, stats: { WIS: 2 } },
      C: { text: 'Aku hidup by default, jarang mempertanyakan diri', points: 0, stats: {} },
      D: { text: 'Sangat dalam. Aku aktif berefleksi dan tahu persis apa yang mendorongku', points: 4, stats: { WIS: 3, INT: 2 } },
      E: { text: 'Cukup baik. Ada gambaran jelas meski masih ada blind spot', points: 3, stats: { WIS: 2, INT: 1 } },
      F: { text: 'Terbatas. Sering terkejut dengan reaksiku sendiri', points: 1, stats: { WIS: 1 } },
    },
  },
  {
    id: 6,
    question: 'Kalau kamu lihat ke belakang, bagaimana sebagian besar waktumu habis dalam seminggu terakhir?',
    options: {
      A: { text: 'Sebagian besar untuk scroll, rebahan, atau hiburan tanpa tujuan', points: 1, stats: { LCK: 1 } },
      B: { text: 'Hampir semua waktu terbuang tanpa aku sadar bagaimana', points: 0, stats: {} },
      C: { text: 'Campuran — sebagian produktif, sebagian hiburan yang kusadari', points: 3, stats: { INT: 2, WIS: 1 } },
      D: { text: 'Sengaja menghindari hal yang berarti karena terasa berat', points: -1, stats: {} },
      E: { text: 'Sebagian besar dengan intention — mengerjakan hal yang bermakna', points: 4, stats: { INT: 2, STR: 2, WIS: 1 } },
      F: { text: 'Lebih banyak santai, sesekali melakukan sesuatu yang berarti', points: 2, stats: { WIS: 1, LCK: 1 } },
    },
  },
  {
    id: 7,
    question: 'Kalau orang-orang terdekatmu diminta jujur, bagaimana mereka menggambarkan kehadiranmu?',
    options: {
      A: { text: 'Sebagai seseorang yang bisa diandalkan dan memberi dampak positif', points: 4, stats: { CHA: 3, WIS: 2 } },
      B: { text: 'Aku mengisolasi diri atau sering meninggalkan dampak negatif', points: -1, stats: {} },
      C: { text: 'Hadir tapi tidak terlalu berkesan', points: 2, stats: { CHA: 1 } },
      D: { text: 'Sebagai teman yang baik, meski tidak selalu konsisten', points: 3, stats: { CHA: 2, WIS: 1 } },
      E: { text: 'Aku tahu hubunganku bermasalah tapi belum berubah', points: 0, stats: {} },
      F: { text: 'Mereka mungkin merasa aku kurang hadir atau sulit diandalkan', points: 1, stats: { CHA: 1 } },
    },
  },
  {
    id: 8,
    question: 'Ketika tekanan datang bertubi-tubi, apa yang paling sering terjadi pada dirimu?',
    options: {
      A: { text: 'Butuh waktu dan kadang membuat keputusan buruk, tapi akhirnya stabil', points: 2, stats: { WIS: 2, VIT: 1 } },
      B: { text: 'Aku bisa tetap tenang, memproses emosi, dan tetap fungsional', points: 4, stats: { WIS: 3, VIT: 2 } },
      C: { text: 'Tekanan membuatku melakukan hal yang kusesali', points: -1, stats: {} },
      D: { text: 'Terguncang sesaat tapi bisa pulih dan tetap mengambil keputusan baik', points: 3, stats: { WIS: 2, VIT: 2 } },
      E: { text: 'Aku hampir selalu kewalahan dan butuh waktu sangat lama untuk pulih', points: 0, stats: { VIT: 1 } },
      F: { text: 'Emosi sering menguasaiku — meledak, menarik diri, atau overthinking', points: 1, stats: { WIS: 1 } },
    },
  },
  {
    id: 9,
    question: 'Ketika melihat sesuatu yang bisa diperbaiki atau peluang yang bisa diambil, apa yang biasanya terjadi?',
    options: {
      A: { text: 'Aku cenderung acuh atau bahkan skeptis terhadap ide-ide baru', points: -1, stats: {} },
      B: { text: 'Langsung berpikir solusi dan sering mengambil inisiatif untuk bertindak', points: 4, stats: { CRE: 3, STR: 2 } },
      C: { text: 'Jarang punya inisiatif — lebih nyaman mengikuti', points: 0, stats: {} },
      D: { text: 'Punya ide tapi perlu kondisi yang tepat untuk eksekusi', points: 3, stats: { CRE: 2, INT: 1 } },
      E: { text: 'Lebih sering menunggu orang lain yang bertindak', points: 1, stats: { CHA: 1 } },
      F: { text: 'Kadang tergerak, kadang tidak — tergantung situasi', points: 2, stats: { CRE: 1, LCK: 1 } },
    },
  },
  {
    id: 10,
    question: 'Seberapa jelas kamu tahu ke mana hidupmu ingin pergi — dan seberapa aktif kamu bergerak ke sana?',
    options: {
      A: { text: 'Aku tidak peduli ke mana hidupku pergi, atau sudah menyerah', points: -1, stats: {} },
      B: { text: 'Samar-samar. Ada gambaran umum tapi belum ada aksi nyata yang konsisten', points: 2, stats: { WIS: 1, LCK: 1 } },
      C: { text: 'Sangat jelas. Aku punya visi, rencana, dan bergerak aktif setiap hari', points: 4, stats: { WIS: 3, LCK: 2 } },
      D: { text: 'Aku sudah berhenti mencoba memikirkan masa depan', points: 0, stats: {} },
      E: { text: 'Bingung. Aku tidak tahu apa yang benar-benar aku inginkan', points: 1, stats: { WIS: 1 } },
      F: { text: 'Cukup jelas. Ada arah yang kutuju meski langkahnya belum konsisten', points: 3, stats: { WIS: 2, LCK: 1 } },
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

/** Rank threshold based on total points (max 40, min -10). */
export function calculateRankFromPoints(totalPoints: number): string {
  if (totalPoints >= 35) return 'A'
  if (totalPoints >= 28) return 'B'
  if (totalPoints >= 20) return 'C'
  if (totalPoints >= 12) return 'D'
  if (totalPoints >= 5) return 'E'
  return 'F'
}

/** Aggregates stats and total points from answers, then derives the rank. */
export function calculateStats(answers: Record<number, OptionKey>): {
  stats: Stats
  totalPoints: number
  rank: string
} {
  const stats = emptyStats()
  let totalPoints = 0

  for (const [qId, choice] of Object.entries(answers)) {
    const q = QUESTIONS.find((item) => item.id === Number(qId))
    if (!q) continue
    const opt = q.options[choice]
    totalPoints += opt.points
    for (const [stat, val] of Object.entries(opt.stats)) {
      stats[stat as StatKey] += val ?? 0
    }
  }

  return { stats, totalPoints, rank: calculateRankFromPoints(totalPoints) }
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
