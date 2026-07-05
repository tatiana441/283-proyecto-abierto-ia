import { SignUp } from '@clerk/react';

export default function SignUpPage() {
  return (
    <main id="main-content" className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <SignUp signInUrl="/login" fallbackRedirectUrl="/dashboard" />
    </main>
  );
}
