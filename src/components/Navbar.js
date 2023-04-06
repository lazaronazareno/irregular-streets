'use client'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()
  return (
    <header>
      <h1 onClick={() => router.push('./')}>Street Cracks</h1>
      <button onClick={() => router.push('./form')}>➕</button>
    </header>
  )
}