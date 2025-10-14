'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  FileText,
  Database,
  Activity,
  Brain,
  Building2,
  Receipt,
  Calculator,
  FileSpreadsheet,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transacciones', href: '/transactions', icon: CreditCard },
  { name: 'Categorías', href: '/categories', icon: FileText },
  { name: 'Facturación', href: '/invoicing', icon: Receipt },
  { name: 'Contabilidad', href: '/accounting', icon: Calculator },
  { name: 'Fiscalidad', href: '/tax', icon: FileSpreadsheet },
  { name: 'Reportes', href: '/reports', icon: BarChart3 },
  { name: 'Power BI', href: '/bi', icon: TrendingUp },
];

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden cursor-pointer"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r transition-all duration-300',
          open ? 'w-64 translate-x-0' : 'w-16 -translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-6 lg:px-4">
          <div className={cn("flex items-center space-x-2 transition-opacity duration-300", open ? "opacity-100" : "opacity-0 lg:hidden")}>
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Finance Pro</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
          {/* Logo colapsado para desktop */}
          {!open && (
            <div className="hidden lg:flex h-8 w-8 rounded-lg bg-primary items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
                  !open && 'lg:justify-center lg:px-2'
                )}
                onClick={() => onOpenChange(false)}
                title={!open ? item.name : undefined}
              >
                <item.icon className="h-5 w-5" />
                <span className={cn("transition-opacity duration-300", !open && "lg:hidden")}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Botón de cerrar adicional */}
        <div className="p-4 border-t lg:hidden">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4 mr-2" />
            Cerrar Menú
          </Button>
        </div>

        {/* User section */}
        <div className="border-t p-4">
          <div className={cn("flex items-center space-x-3 mb-4", !open && "lg:hidden")}>
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session?.user?.name || 'Usuario'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
          
          <Link
            href="/profile"
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === '/profile' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
              !open && 'lg:justify-center lg:px-2'
            )}
            onClick={() => onOpenChange(false)}
            title={!open ? "Perfil" : undefined}
          >
            <User className="h-5 w-5" />
            <span className={cn("transition-opacity duration-300", !open && "lg:hidden")}>Perfil</span>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className={cn("w-full justify-start mt-2", !open && "lg:hidden")}
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
          {/* Logout icon para desktop colapsado */}
          {!open && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex w-12 h-12 justify-center mt-2"
              onClick={handleSignOut}
              title="Cerrar Sesión"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

    </>
  );
}
