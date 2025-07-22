import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to the new overview page
  redirect('/overview')
}
