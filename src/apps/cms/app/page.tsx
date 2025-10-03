import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirecionar para o admin
  redirect('/admin');
}