import { redirect } from 'next/navigation';

export default function Home(){

  // Abre logo o login!
  redirect('auth/login');
}