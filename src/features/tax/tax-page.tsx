'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Search, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  FileSpreadsheet,
  Euro,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calculator
} from 'lucide-react';
import { showNotification } from '@/components/notification-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TaxReport {
  id: string;
  type: 'IVA' | 'IRPF' | 'IS';
  period: string;
  totalPayable: number;
  totalReceivable: number;
  netAmount: number;
  status: 'DRAFT' | 'SUBMITTED' | 'PAID';
  dueDate?: string;
  submittedAt?: string;
}

interface TaxStats {
  totalReports: number;
  totalPayable: number;
  totalReceivable: number;
  netAmount: number;
  pendingReports: number;
}

export function TaxPage() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<TaxReport[]>([]);
  const [stats, setStats] = useState<TaxStats>({
    totalReports: 0,
    totalPayable: 0,
    totalReceivable: 0,
    netAmount: 0,
    pendingReports: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<TaxReport | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    type: 'IVA',
    period: '',
    totalPayable: '',
    totalReceivable: '',
    notes: '',
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tax/reports');
      if (!response.ok) {
        throw new Error('Failed to fetch tax reports');
      }
      const data = await response.json();
      setReports(data.reports || []);
      setStats(data.stats || stats);
    } catch (error) {
      console.error('Error fetching tax reports:', error);
      showNotification.error('Error', 'No se pudieron cargar los informes fiscales');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async () => {
    try {
      const response = await fetch('/api/tax/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          period: formData.period,
          totalPayable: parseFloat(formData.totalPayable) || 0,
          totalReceivable: parseFloat(formData.totalReceivable) || 0,
        }),
      });

      if (response.ok) {
        showNotification.success('Informe creado', 'El informe fiscal se ha creado correctamente');
        setIsCreateDialogOpen(false);
        resetForm();
        fetchReports();
      } else {
        throw new Error('Failed to create report');
      }
    } catch (error) {
      console.error('Error creating tax report:', error);
      showNotification.error('Error', 'No se pudo crear el informe fiscal');
    }
  };

  const handleUpdateReport = async () => {
    if (!editingReport) return;

    try {
      const response = await fetch(`/api/tax/reports/${editingReport.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          period: formData.period,
          totalPayable: parseFloat(formData.totalPayable) || 0,
          totalReceivable: parseFloat(formData.totalReceivable) || 0,
        }),
      });

      if (response.ok) {
        showNotification.success('Informe actualizado', 'El informe fiscal se ha actualizado correctamente');
        setEditingReport(null);
        resetForm();
        fetchReports();
      } else {
        throw new Error('Failed to update report');
      }
    } catch (error) {
      console.error('Error updating tax report:', error);
      showNotification.error('Error', 'No se pudo actualizar el informe fiscal');
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este informe fiscal?')) return;

    try {
      const response = await fetch(`/api/tax/reports/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showNotification.success('Informe eliminado', 'El informe fiscal se ha eliminado correctamente');
        fetchReports();
      } else {
        throw new Error('Failed to delete report');
      }
    } catch (error) {
      console.error('Error deleting tax report:', error);
      showNotification.error('Error', 'No se pudo eliminar el informe fiscal');
    }
  };

  const handleSubmitReport = async (id: string) => {
    try {
      const response = await fetch(`/api/tax/reports/${id}/submit`, {
        method: 'POST',
      });

      if (response.ok) {
        showNotification.success('Informe enviado', 'El informe fiscal se ha enviado correctamente');
        fetchReports();
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting tax report:', error);
      showNotification.error('Error', 'No se pudo enviar el informe fiscal');
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'IVA',
      period: '',
      totalPayable: '',
      totalReceivable: '',
      notes: '',
    });
  };

  const openEditDialog = (report: TaxReport) => {
    setEditingReport(report);
    setFormData({
      type: report.type,
      period: report.period,
      totalPayable: report.totalPayable.toString(),
      totalReceivable: report.totalReceivable.toString(),
      notes: '',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      DRAFT: 'secondary',
      SUBMITTED: 'default',
      PAID: 'default',
    } as const;

    const labels = {
      DRAFT: 'Borrador',
      SUBMITTED: 'Enviado',
      PAID: 'Pagado',
    };

    const icons = {
      DRAFT: <Clock className="h-3 w-3" />,
      SUBMITTED: <CheckCircle className="h-3 w-3" />,
      PAID: <CheckCircle className="h-3 w-3" />,
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'} className="flex items-center gap-1">
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      IVA: 'IVA',
      IRPF: 'IRPF',
      IS: 'Impuesto Sociedades',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const netAmount = (parseFloat(formData.totalPayable) || 0) - (parseFloat(formData.totalReceivable) || 0);

  if (loading) {
    return <div>Cargando informes fiscales...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Informes</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground">
              Informes fiscales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Pagar</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalPayable.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR',
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Total a pagar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Cobrar</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalReceivable.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR',
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Total a cobrar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Neto</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.netAmount >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {stats.netAmount.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR',
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.netAmount >= 0 ? 'A pagar' : 'A cobrar'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar informes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="IVA">IVA</SelectItem>
              <SelectItem value="IRPF">IRPF</SelectItem>
              <SelectItem value="IS">Impuesto Sociedades</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Informe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nuevo Informe Fiscal</DialogTitle>
                <DialogDescription>
                  Crea un nuevo informe fiscal
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Impuesto *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IVA">IVA</SelectItem>
                        <SelectItem value="IRPF">IRPF</SelectItem>
                        <SelectItem value="IS">Impuesto de Sociedades</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="period">Período *</Label>
                    <Input
                      id="period"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      placeholder="Q1/2025, 2025, etc."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalPayable">Total a Pagar</Label>
                    <Input
                      id="totalPayable"
                      type="number"
                      step="0.01"
                      value={formData.totalPayable}
                      onChange={(e) => setFormData({ ...formData, totalPayable: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalReceivable">Total a Cobrar</Label>
                    <Input
                      id="totalReceivable"
                      type="number"
                      step="0.01"
                      value={formData.totalReceivable}
                      onChange={(e) => setFormData({ ...formData, totalReceivable: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Total a Pagar:</span>
                    <span>{(parseFloat(formData.totalPayable) || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total a Cobrar:</span>
                    <span>{(parseFloat(formData.totalReceivable) || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                    <span>Neto:</span>
                    <span className={netAmount >= 0 ? 'text-red-600' : 'text-green-600'}>
                      {netAmount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateReport}>
                  Crear Informe
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Informes Fiscales</CardTitle>
          <CardDescription>
            Lista de informes fiscales ({filteredReports.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>A Pagar</TableHead>
                <TableHead>A Cobrar</TableHead>
                <TableHead>Neto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    {getTypeLabel(report.type)}
                  </TableCell>
                  <TableCell>{report.period}</TableCell>
                  <TableCell>
                    {report.totalPayable.toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </TableCell>
                  <TableCell>
                    {report.totalReceivable.toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </TableCell>
                  <TableCell>
                    <span className={report.netAmount >= 0 ? 'text-red-600' : 'text-green-600'}>
                      {report.netAmount.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(report.status)}
                  </TableCell>
                  <TableCell>
                    {report.dueDate ? format(new Date(report.dueDate), 'dd/MM/yyyy', { locale: es }) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(report)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {report.status === 'DRAFT' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleSubmitReport(report.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingReport} onOpenChange={() => setEditingReport(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Informe Fiscal</DialogTitle>
            <DialogDescription>
              Modifica los datos del informe fiscal
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Tipo de Impuesto *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IVA">IVA</SelectItem>
                    <SelectItem value="IRPF">IRPF</SelectItem>
                    <SelectItem value="IS">Impuesto de Sociedades</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-period">Período *</Label>
                <Input
                  id="edit-period"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  placeholder="Q1/2025, 2025, etc."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-totalPayable">Total a Pagar</Label>
                <Input
                  id="edit-totalPayable"
                  type="number"
                  step="0.01"
                  value={formData.totalPayable}
                  onChange={(e) => setFormData({ ...formData, totalPayable: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-totalReceivable">Total a Cobrar</Label>
                <Input
                  id="edit-totalReceivable"
                  type="number"
                  step="0.01"
                  value={formData.totalReceivable}
                  onChange={(e) => setFormData({ ...formData, totalReceivable: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Total a Pagar:</span>
                <span>{(parseFloat(formData.totalPayable) || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total a Cobrar:</span>
                <span>{(parseFloat(formData.totalReceivable) || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Neto:</span>
                <span className={netAmount >= 0 ? 'text-red-600' : 'text-green-600'}>
                  {netAmount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingReport(null)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateReport}>
              Actualizar Informe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
