import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Toaster } from '@/components/ui/toaster';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <Toaster />
    </div>
  );
};