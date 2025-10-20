import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client'; // conexão com o Supabase

interface Laundry {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  logo?: string;
  defaultDeliveryDays: number;
}

interface LaundryFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  defaultDeliveryDays: number;
  logo?: string;
}

interface LaundryContextType {
  laundries: Laundry[];
  setLaundries: (laundries: Laundry[]) => void;
  addLaundry: (laundry: LaundryFormData) => void;
  updateLaundry: (id: string, laundry: LaundryFormData) => void;
  deleteLaundry: (id: string) => void;
  getLaundryById: (id: string) => Laundry | undefined;
}

const LaundryContext = createContext<LaundryContextType | undefined>(undefined);

export const LaundryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [laundries, setLaundries] = useState<Laundry[]>([]);

  useEffect(() => {
    const fetchLaundries = async () => {
      const { data, error } = await supabase.from('laundries').select('*');
      if (error) {
        console.error('Erro ao buscar lavanderias:', error.message);
        return;
      }
      setLaundries(data || []);
    };

    fetchLaundries();
  }, []);

  const addLaundry = async (laundryData: LaundryFormData) => {
    const { data, error } = await supabase
      .from('laundries')
      .insert(laundryData)
      .select();

    if (error) {
      console.error('Erro ao adicionar lavanderia:', error.message);
      return;
    }

    if (data && data.length > 0) {
      setLaundries((prev) => [...prev, data[0]]);
    }
  };

  const updateLaundry = async (id: string, laundryData: LaundryFormData) => {
    const { error } = await supabase
      .from('laundries')
      .update(laundryData)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar lavanderia:', error.message);
      return;
    }

    const { data: updated, error: fetchError } = await supabase
      .from('laundries')
      .select('*')
      .eq('id', id)
      .single();

    if (!fetchError && updated) {
      setLaundries((prev) => prev.map((l) => (l.id === id ? updated : l)));
    }
  };

  const deleteLaundry = async (id: string) => {
    const { error } = await supabase
      .from('laundries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir lavanderia:', error.message);
      return;
    }

    setLaundries((prev) => prev.filter((l) => l.id !== id));
  };

  const getLaundryById = (id: string): Laundry | undefined => {
    return laundries.find((l) => l.id === id);
  };

  return (
    <LaundryContext.Provider
      value={{
        laundries,
        setLaundries,
        addLaundry,
        updateLaundry,
        deleteLaundry,
        getLaundryById,
      }}
    >
      {children}
    </LaundryContext.Provider>
  );
};

export const useLaundries = () => {
  const context = useContext(LaundryContext);
  if (context === undefined) {
    throw new Error('useLaundries must be used within a LaundryProvider');
  }
  return context;
};
