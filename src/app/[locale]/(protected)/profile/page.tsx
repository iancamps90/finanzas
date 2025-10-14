import { Suspense } from 'react';
import { ProfilePage } from '@/features/profile/profile-page';
import { LoadingSpinner } from '@/components/loading-spinner';

export default function Profile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground text-gradient">
          Perfil
        </h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y configuración
        </p>
      </div>
      
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      }>
        <ProfilePage />
      </Suspense>
    </div>
  );
}
