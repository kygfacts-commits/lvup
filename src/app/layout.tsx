import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LvUp — Level Up Yourself',
  description:
    'Track habits, complete quests, unlock skills. Your life — gamified.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
