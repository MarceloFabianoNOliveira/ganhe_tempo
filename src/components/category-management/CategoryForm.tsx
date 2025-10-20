
import React from "react";
import { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "../CategoryManagement";
import { useLaundries } from "@/contexts/LaundryContext";

type FormValues = {
  code:string;
  name: string;
  description: string;
  supply_unit:string;
  laundry_id: string;
  price: string;
};


function formatCurrency(value: string): string {
  // remove tudo que não é número
  const numeric = value.replace(/\D/g, "");

  // se vazio, retorna vazio
  if (!numeric) return "";

  // transforma em centavos
  const number = (parseInt(numeric, 10) / 100).toFixed(2);

  // aplica máscara de moeda brasileira
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(number));
}

interface CategoryFormProps {
  onSubmit: (values: Omit<Category, "id">, id?: string) => void;
  initialData?: Category;
  onCancel?: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
}) => {
  const { laundries } = useLaundries();
  const form = useForm<FormValues>({
  defaultValues: {
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    supply_unit: initialData?.supply_unit ?? "",
    laundry_id:
      initialData?.laundry_id
        ? String(initialData.laundry_id)
        : laundries[0]?.id
        ? String(laundries[0].id)
        : "",
    price: initialData?.price ?? "",    
  },
});

  // Se initialData ou laundries mudar, reset o formulário
  React.useEffect(() => {
  form.reset({
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    supply_unit: initialData?.supply_unit ?? "",
    laundry_id:
      initialData?.laundry_id
        ? String(initialData.laundry_id)
        : laundries[0]?.id
        ? String(laundries[0].id)
          : "",
    price: initialData?.price ?? "",      
    });
  }, [initialData, laundries, form]);

  //console.log("lavanderia", laundries);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          onSubmit(values, initialData?.id)
        )}
        className="space-y-4"
      >

        <FormField
          control={form.control}
          name="code"
          rules={{ required: "O preço é obrigatório" }} // fallback se não usar Zod
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Código" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="laundry_id"
            rules={{ required: "O preço é obrigatório" }} // fallback se não usar Zod
            render={({ field }) => (
              <FormItem>
                <FormLabel>Negócio</FormLabel>

                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined} // undefined mostra o placeholder
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o negócio" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {laundries.map((laundry) => (
                      <SelectItem key={laundry.id} value={String(laundry.id)}>
                        {laundry.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "O preço é obrigatório" }} // fallback se não usar Zod
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nome da categoria" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="supply_unit"
            rules={{ required: "O preço é obrigatório" }} // fallback se não usar Zod
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidade Fornecimento</FormLabel>

                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {/* Unidades genéricas */}
                    <SelectItem value="UN">Unidade (UN)</SelectItem>
                    <SelectItem value="CX">Caixa (CX)</SelectItem>
                    <SelectItem value="PC">Peça (PC)</SelectItem>
                    <SelectItem value="KG">Quilo (KG)</SelectItem>

                    {/* Costura / facção */}
                    <SelectItem value="MT">Metro (MT)</SelectItem>
                    <SelectItem value="CM">Centímetro (CM)</SelectItem>
                    <SelectItem value="DZ">Dúzia (DZ)</SelectItem>
                    <SelectItem value="PAR">Par (PAR)</SelectItem>
                    <SelectItem value="H">Hora de Serviço (H)</SelectItem>

                    {/* Lavanderia */}
                    <SelectItem value="KG_ROUPA">Quilo de Roupa (KG)</SelectItem>
                    <SelectItem value="TON">Tonelada (TON)</SelectItem>
                    <SelectItem value="SERV">Serviço (SERV)</SelectItem>
                    <SelectItem value="CARGA">Carga (CARGA)</SelectItem>
                    <SelectItem value="LOTE">Lote (LOTE)</SelectItem>
                    
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
          control={form.control}
          name="price"
          rules={{ required: "O preço é obrigatório" }} // fallback se não usar Zod
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço (R$)</FormLabel>
              <FormControl>
                <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="Preço"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const formatted = formatCurrency(e.target.value);
                      field.onChange(formatted); // mantém no form
                    }}
                  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Descrição da categoria"
                  className="resize-none" // evita redimensionamento, se quiser
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" variant="default">
            {initialData ? "Salvar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
