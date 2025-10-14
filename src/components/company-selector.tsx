'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building2, ChevronDown } from 'lucide-react';
import { showNotification } from '@/components/notification-toast';

interface Company {
  id: string;
  name: string;
  cif: string;
  role: string;
}

export function CompanySelector() {
  const { data: session } = useSession();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserCompanies();
    }
  }, [session?.user?.id]);

  const fetchUserCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
        // Set first company as default
        if (data.length > 0) {
          setSelectedCompany(data[0].id);
          localStorage.setItem('selectedCompanyId', data[0].id);
        }
      }
    } catch (error) {
      showNotification.error('Error', 'No se pudieron cargar las empresas');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompany(companyId);
    localStorage.setItem('selectedCompanyId', companyId);
    showNotification.success('Empresa cambiada', 'Se ha seleccionado una nueva empresa');
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Building2 className="h-4 w-4" />
        <span className="text-sm text-muted-foreground">Cargando...</span>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="flex items-center space-x-2">
        <Building2 className="h-4 w-4" />
        <span className="text-sm text-muted-foreground">Sin empresas</span>
      </div>
    );
  }

  const currentCompany = companies.find(c => c.id === selectedCompany);

  return (
    <div className="flex items-center space-x-2">
      <Building2 className="h-4 w-4" />
      <Select value={selectedCompany} onValueChange={handleCompanyChange}>
        <SelectTrigger className="w-[200px] h-8">
          <SelectValue>
            {currentCompany ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{currentCompany.name}</span>
                <span className="text-xs text-muted-foreground">({currentCompany.role})</span>
              </div>
            ) : (
              'Seleccionar empresa'
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {companies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              <div className="flex flex-col">
                <span className="font-medium">{company.name}</span>
                <span className="text-xs text-muted-foreground">
                  {company.cif} • {company.role}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
