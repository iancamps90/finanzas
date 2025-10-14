import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Download, Upload, FileText } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button asChild className="h-auto flex-col space-y-2 p-4">
            <Link href="/transactions/new">
              <Plus className="h-6 w-6" />
              <span>Nueva Transacción</span>
            </Link>
          </Button>

          <Button variant="outline" asChild className="h-auto flex-col space-y-2 p-4">
            <Link href="/transactions/import">
              <Upload className="h-6 w-6" />
              <span>Importar CSV</span>
            </Link>
          </Button>

          <Button variant="outline" asChild className="h-auto flex-col space-y-2 p-4">
            <Link href="/reports/export">
              <Download className="h-6 w-6" />
              <span>Exportar Datos</span>
            </Link>
          </Button>

          <Button variant="outline" asChild className="h-auto flex-col space-y-2 p-4">
            <Link href="/reports">
              <FileText className="h-6 w-6" />
              <span>Ver Reportes</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

