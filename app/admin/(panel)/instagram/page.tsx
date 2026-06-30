import { Metadata } from 'next'
import { InstagramClient } from './instagram-client'

export const metadata: Metadata = {
  title: 'Instagram - Admin',
}

export default function InstagramPage() {
  return <InstagramClient />
}
