import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useLaundries } from "@/contexts/LaundryContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type DemandImpress = {
  client_name: string;
  client_email: string;
  client_phone: string;
  cpf_cnpj: string;
  category: string;
  description: string;
  price: string;
  notes: string;
  business_name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  defaultDeliveryDays: number;
  logo?: string;
  status: string;
  name: string;
  responsavel: string;
  codUnico: string;
  discount: string;
  created_at?: string; // <-- ajuste se sua coluna de data tiver outro nome
};

export const Reports: React.FC = () => {
  const { user } = useAuth();
  const { laundries } = useLaundries();

  // Branding (igual ao seu)
  const mainLaundry = laundries.length > 0 ? laundries[0] : null;
  const showBusinessBranding = user && (user.role === "operator" || user.role === "manager");
  const businessName = showBusinessBranding ? mainLaundry?.name || "Lavanderia" : mainLaundry?.name;
  const businessLogo = showBusinessBranding && mainLaundry?.logo ? mainLaundry.logo : undefined;

  // Filtros
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [responsavel, setResponsavel] = useState<string>(""); // vazio = todos

  // Dados
  const [loading, setLoading] = useState(false);
  const [demands, setDemands] = useState<DemandImpress[]>([]);
  const [responsaveis, setResponsaveis] = useState<string[]>([]);

  const brl = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const formatDateTime = (iso?: string) =>
    iso
      ? new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(iso))
      : "";

  // Carrega lista de responsáveis (distinct)
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("demand_impress")
        .select("responsavel")
        .not("responsavel", "is", null);
      if (error) return console.error(error);
      const uniq = Array.from(new Set((data || []).map((d: any) => (d.responsavel || "").trim()))).filter(
        Boolean
      );
      uniq.sort((a, b) => a.localeCompare(b, "pt-BR"));
      setResponsaveis(uniq);
    })();
  }, []);

  // Consulta
  const handleSearch = async () => {
    try {
      setLoading(true);

      let query = supabase.from("demand_impress").select("*").order("created_at", { ascending: false });

      // datas (inclui final do dia)
      if (startDate) {
        query = query.gte("created_at", `${startDate}T00:00:00`);
      }
      if (endDate) {
        query = query.lte("created_at", `${endDate}T23:59:59`);
      }

      // responsável (ilike para flexibilidade)
      if (responsavel && responsavel !== "ALL") {
        query = query.ilike("responsavel", `%${responsavel}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      setDemands((data ?? []) as DemandImpress[]);
      if (!data || data.length === 0) {
        toast({ title: "Nenhum resultado", description: "Nenhuma demanda encontrada com os filtros." });
      }
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Erro ao buscar",
        description: e?.message ?? "Tente novamente em instantes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // totalizador simples da busca
  const totalBusca = useMemo(
    () =>
      demands.reduce((acc, d) => acc + (Number(String(d.price).replace(",", ".")) || 0), 0),
    [demands]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">Visualize e exporte relatórios de demandas e performance</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <center>
            {businessLogo && (
              <div className="logo" style={{ width: 180, textAlign: "right" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={businessLogo}
                  alt="Logo"
                  style={{ maxWidth: "100%", maxHeight: 90, objectFit: "contain" }}
                />
              </div>
            )}
            <p>{businessName}</p>
          </center>
          <CardTitle>Filtros de Relatório</CardTitle>
          <CardDescription>Configure os parâmetros para gerar relatórios personalizados</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Data Inicial</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Data Final</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Responsável</Label>
              
              <Select value={responsavel} onValueChange={(v) => setResponsavel(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                {responsaveis.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button className="w-full md:w-auto" onClick={handleSearch} disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              {loading ? "Buscando..." : "Pesquisar"}
            </Button>
            {demands.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {demands.length} resultado(s) — Total: <b>{brl(totalBusca)}</b>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de resultados */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados</CardTitle>
          <CardDescription>Demandas encontradas com os filtros aplicados</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="[&>th]:px-3 [&>th]:py-2 text-left">
                    <th>Cod</th>
                    <th>Cliente</th>
                    <th>Descrição</th>
                    <th>Responsável</th>
                    <th>Status</th>
                    <th>Preço</th>
                    <th>Comissão</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {demands.map((d) => (
                    <tr key={d.codUnico} className="border-b last:border-0 [&>td]:px-3 [&>td]:py-2">
                      <td className="font-mono">{d.codUnico}</td>
                      <td>{d.client_name}</td>
                      <td className="max-w-[380px] truncate" title={d.description}>
                        {d.description}
                      </td>
                      <td>{d.responsavel}</td>
                      <td>{d.status}</td>
                      <td className="text-center">{brl(Number(String(d.price).replace(",", ".")) || 0)}</td>
                      <td></td>
                      <td>{formatDateTime(d.created_at)}</td>
                    </tr>
                  ))}
                  {demands.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        Nenhum dado para exibir. Defina os filtros e clique em “Pesquisar”.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
