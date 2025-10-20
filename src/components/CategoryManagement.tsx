import React, { useState, useEffect } from "react";
import { Tags, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "./category-management/CategoryForm";
import { CategoryTable } from "./category-management/CategoryTable";
import { useLaundries } from "@/contexts/LaundryContext";
import { supabase } from '@/integrations/supabase/client';

export type Category = {
  id: string;
  code:string;
  name: string;
  description: string;
  supply_unit: string;
  laundry_id: string;
  price: string;
};

export const CategoryManagement: React.FC = () => {
  const { laundries } = useLaundries();  
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState<null | Category>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("*");

      if (error) {
        console.error("Erro ao buscar categorias:", error.message);     
        toast({ title: "Erro ao buscar categorias", description: error.message });
        return;
      }

      if (!data || data.length === 0) {
        /*const initialSeed = [
          {
            id: "1",
            name: "Roupa delicada",
            description: "Lavagem de peças delicadas",
            laundry_id: laundries[0]?.id || "1",
          },
          {
            id: "2",
            name: "Roupa de cama",
            description: "Serviço para lençóis, cobertores e afins",
            laundry_id: laundries[0]?.id || "1",
          },
        ];
        setCategories(initialSeed);*/
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  const handleSave = async (category: Omit<Category, "id">, id?: string) => {
    if (id) {
      console.log("id", id)
      // Editar categoria existente
      const { error: updateError } = await supabase
        .from("categories")
        .update(category)
        .eq("id", id);

      if (updateError) {
        toast({ title: "Erro ao atualizar categoria", description: updateError.message });
        return;
      }

      const { data: updatedData, error: fetchError } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError || !updatedData) {
        toast({ title: "Erro ao buscar categoria atualizada", description: fetchError?.message || "Sem retorno" });
        return;
      }

      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? updatedData : cat))
      );

      toast({ title: "Categoria atualizada!" });

    } else {
      // Criar nova categoria
      const { data, error } = await supabase
        .from("categories")
        .insert(category)
        .select();

      if (error || !data || !data[0]) {
        toast({ title: "Erro ao cadastrar categoria", description: error?.message || "Erro desconhecido" });
        return;
      }

      setCategories((prev) => [...prev, data[0]]);
      toast({ title: "Categoria cadastrada!" });
    }

    setDialogOpen(false);
    setEditMode(null);
  };

  const handleEdit = (cat: Category) => {
    setEditMode(cat);
    setDialogOpen(true);
  };

  const handleRemove = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    toast({ title: "Categoria removida." });
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white rounded shadow p-8 flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3">
        <Tags className="h-10 w-10 text-laundry-blue mb-2" />
        <h2 className="text-2xl font-bold text-laundry-blue mb-2">
          Cadastro de Categoria de serviço
        </h2>
        <p className="text-muted-foreground text-center leading-relaxed mb-2">
          Cadastre, visualize, edite ou remova as categorias de serviço oferecidas pela lavanderia.
        </p>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditMode(null);
          }}
        >
          <DialogTrigger asChild>
            <Button variant="default" onClick={() => setEditMode(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editMode ? "Editar categoria" : "Cadastrar nova categoria"}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm
              onSubmit={handleSave}
              initialData={editMode || undefined}
              onCancel={() => {
                setDialogOpen(false);
                setEditMode(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />
      </div>
    </div>
  );
};
