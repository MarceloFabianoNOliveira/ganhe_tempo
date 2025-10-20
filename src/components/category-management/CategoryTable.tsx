
import React, { useState } from "react";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Category } from "../CategoryManagement";
import { useLaundries } from "@/contexts/LaundryContext";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onRemove: (id: string) => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  onEdit,
  onRemove
}) => {
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { laundries } = useLaundries();

  const getLaundryName = (laundry_id: string) => {
    return laundries.find(l => l.id === laundry_id)?.name || "—";
  };

  const handleRemove = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      onRemove(id);
      setRemovingId(null);
    }, 500); // animação/opção para loading mínimo
  };

  if (categories.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        Nenhuma categoria cadastrada ainda.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>UNid. Fornecimento</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Negócio</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(categories) && categories.map((cat) => (
          
          <TableRow key={cat.id}>
            <TableCell>{cat.code}</TableCell>
            <TableCell>{cat.name}</TableCell>
            <TableCell>{cat.supply_unit}</TableCell>
            <TableCell>{cat.price}</TableCell>
            <TableCell>{cat.description}</TableCell>
            <TableCell>{getLaundryName(cat.laundry_id)}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(cat)}
                className="mr-1"
                title="Editar"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemove(cat.id)}
                disabled={removingId === cat.id}
                title="Remover"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
