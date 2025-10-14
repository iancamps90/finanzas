'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema, type TransactionInput } from '@/lib/validations/transaction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Save, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  color: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  description: string | null;
  paymentMethod: string;
  tags: string[];
  category: {
    id: string;
    name: string;
    type: 'INCOME' | 'EXPENSE';
    color: string;
  };
}

interface EditTransactionFormProps {
  transactionId: string;
}

export function EditTransactionForm({ transactionId }: EditTransactionFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
  });

  const selectedType = watch('type');

  useEffect(() => {
    fetchCategories();
    fetchTransaction();
  }, [transactionId]);

  useEffect(() => {
    if (transaction) {
      reset({
        amount: transaction.amount,
        type: transaction.type,
        categoryId: transaction.category.id,
        date: new Date(transaction.date),
        description: transaction.description || '',
        paymentMethod: transaction.paymentMethod as any,
        tags: transaction.tags,
      });
      setInitialLoading(false);
    }
  }, [transaction, reset]);

  useEffect(() => {
    // Filter categories based on selected type
    if (selectedType) {
      const filteredCategories = categories.filter(cat => cat.type === selectedType);
      if (filteredCategories.length > 0 && !filteredCategories.find(cat => cat.id === watch('categoryId'))) {
        setValue('categoryId', filteredCategories[0].id);
      }
    }
  }, [selectedType, categories, setValue, watch]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      toast.error('Error al cargar las categorías');
    }
  };

  const fetchTransaction = async () => {
    try {
      const response = await fetch(`/api/transactions/${transactionId}`);
      if (response.ok) {
        const data = await response.json();
        setTransaction(data);
      } else {
        toast.error('Error al cargar la transacción');
        router.push('/transactions');
      }
    } catch (error) {
      toast.error('Error al cargar la transacción');
      router.push('/transactions');
    }
  };

  const onSubmit = async (data: TransactionInput) => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Transacción actualizada exitosamente');
        router.push('/transactions');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error al actualizar la transacción');
      }
    } catch (error) {
      toast.error('Error al actualizar la transacción');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/transactions');
  };

  const filteredCategories = categories.filter(cat => cat.type === selectedType);

  if (initialLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Cargando transacción...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Transacción</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Monto *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount', { valueAsNumber: true })}
                aria-invalid={errors.amount ? 'true' : 'false'}
              />
              {errors.amount && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={selectedType}
                onValueChange={(value: 'INCOME' | 'EXPENSE') => setValue('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">Ingreso</SelectItem>
                  <SelectItem value="EXPENSE">Gasto</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoría *</Label>
              <Select
                value={watch('categoryId')}
                onValueChange={(value) => setValue('categoryId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Fecha *</Label>
              <Input
                id="date"
                type="date"
                {...register('date', { valueAsDate: true })}
                aria-invalid={errors.date ? 'true' : 'false'}
              />
              {errors.date && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Método de Pago</Label>
              <Select
                value={watch('paymentMethod')}
                onValueChange={(value: 'CARD' | 'CASH' | 'TRANSFER' | 'OTHER') => 
                  setValue('paymentMethod', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CARD">Tarjeta</SelectItem>
                  <SelectItem value="CASH">Efectivo</SelectItem>
                  <SelectItem value="TRANSFER">Transferencia</SelectItem>
                  <SelectItem value="OTHER">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                placeholder="Descripción de la transacción"
                {...register('description')}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Actualizar Transacción
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

