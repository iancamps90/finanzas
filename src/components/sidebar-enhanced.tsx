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
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  submenu?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transacciones', href: '/transactions', icon: CreditCard },
  { name: 'Categorías', href: '/categories', icon: FileText },
  { name: 'Reportes', href: '/reports', icon: BarChart3 },
  { 
    name: 'Power BI', 
    href: '/bi', 
    icon: TrendingUp,
    submenu: [
      { name: 'Integración', href: '/bi', icon: TrendingUp },
      { name: 'Analytics Avanzado', href: '/powerbi/advanced', icon: BarChart3 },
      { name: 'Tiempo Real', href: '/powerbi/realtime', icon: Activity },
      { name: 'AI Insights', href: '/powerbi/ai', icon: Brain },
      { name: 'Reportes Auto', href: '/powerbi/reports', icon: FileText },
      { name: 'Conectores', href: '/powerbi/connectors', icon: Database },
    ]
  },
  { name: 'Perfil', href: '/profile', icon: User },
];

function NavigationItem({ item, pathname }: { item: NavigationItem; pathname: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = pathname === item.href || (item.submenu && item.submenu.some(sub => pathname === sub.href));
  const hasSubmenu = item.submenu && item.submenu.length > 0;

  return (
    <div>
      <div className="flex items-center">
        <Link
          href={item.href}
          className={cn(
            'sidebar-item flex-1',
            isActive && 'active'
          )}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.name}</span>
        </Link>
        {hasSubmenu && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      
      {hasSubmenu && isExpanded && (
        <div className="ml-6 mt-2 space-y-1">
          {item.submenu!.map((subItem) => {
            const isSubActive = pathname === subItem.href;
            return (
              <Link
                key={subItem.href}
                href={subItem.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  isSubActive && 'bg-primary text-primary-foreground'
                )}
              >
                <subItem.icon className="h-4 w-4" />
                <span>{subItem.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function SidebarEnhanced({ open, onOpenChange }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 transform border-r bg-background transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">Finance Dash Pro</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {navigation.map((item) => (
              <NavigationItem key={item.href} item={item} pathname={pathname} />
            ))}
          </nav>

          {/* User section */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
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
            
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="flex-1">
                <Settings className="h-4 w-4 mr-2" />
                Config
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="flex-1"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

