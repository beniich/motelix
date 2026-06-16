import { redirect } from 'next/navigation';

// Root locale page: always redirect to dashboard.
// The middleware handles unauthenticated users → /login.
export default function LocaleRootPage() {
  redirect('/dashboard');
}
