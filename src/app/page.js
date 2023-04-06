import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import Mapa from '@/components/Map'
import Formulario from '@/components/Form'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Mapa />
    </>
  )
}
