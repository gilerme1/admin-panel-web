// src/app/page.tsx
'use client';

import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/login');
  
  return null;
}

