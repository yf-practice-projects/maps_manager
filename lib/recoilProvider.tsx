'use client'
import { RecoilRoot } from 'recoil';

export function Recoil({ children }: { children: React.ReactNode }) {
  return <RecoilRoot>{children}</RecoilRoot>
}