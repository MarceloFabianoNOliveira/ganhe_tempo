import React, { createContext, useContext, useEffect, useState } from 'react';
import { Demand, Demand_category, Demand_photos, Category, Payment_method, Demand_payment } from '@/types/demand';
import { supabase } from '@/integrations/supabase/client'; // conexão com o Supabase
import { useAuth } from '@/contexts/AuthContext'; // Adicione esta linha


interface DemandContextType {
  demands: Demand[];
  //addDemand: (demand: Demand) => Promise<void>;
  addDemand: (demand: Omit<Demand, "id">) => Promise<string | null>;
  updateDemand: (id: string, updates: Partial<Demand>) => Promise<void>;
  deleteDemand: (id: string) => Promise<void>;
  updateDemandStatus: (id: string, status: string) => Promise<void>;
  getDemandsByStatus: (status: string) => Demand[];
  sendEmailNotification: (demand: Demand) => void; 

  //INSERIR CATEGORIAS
  addCategories: (categories: Omit<Demand_category, "id">) => Promise<string | null>;

  //INSERIR PHOTOS DA DEMANDA
  addDemandPhotos(photos: Omit<Demand_photos, "id">): Promise<string | null>;

  //INSERIR PHOTOS DA DEMANDA
  addDemandPayment(payment: Omit<Demand_payment, "id">): Promise<string | null>;

  //CONSULTAR CATEGORIAS
  selectCategories: () => Promise<Category[] | null>

  //CONSULTAR PAGAMENTOS
  selectPayments: () => Promise<Payment_method[] | null>;

}

  const DemandContext = createContext<DemandContextType | undefined>(undefined);  
  export const DemandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const { user } = useAuth(); // Pega o usuário logado
  const [demands, setDemands] = useState<Demand[]>([]); 
  
  //CATEGORIAS
  //const [categories, setCategories] = useState<Demand_category[]>([]);

 
  useEffect(() => {
    const fetchDemands = async () => {
      if (!user?.id || !user?.laundryId) {
        console.log("Usuário ou lavanderia ainda não carregados");
        return;
      }
       //console.log("USER ", user);
      //console.log("")
      if (user?.role === 'admin') {
            const { data, error } = await supabase
                .from('demands_full')
                .select('*')
                //.eq("owner",user?.id)                
                .order('created_at', { ascending: false });    
                  
            if (error) {
              console.error('Erro ao carregar demandas:', error.message);
            } else if (data) {
              console.log(data);
              setDemands(data);
            }
        }else{

            const { data, error } = await supabase
                .from('demands_full')
                .select('*')
                //.eq("owner",user?.id)
                .eq("laundry_id",user?.laundryId)
                .order('created_at', { ascending: false });    
                  
            if (error) {
              console.error('Erro ao carregar demandas:', error.message);
            } else if (data) {
              console.log(data);
              setDemands(data);
            }

        }    
    };
    fetchDemands();
  }, [user]);
  
  //ADICIONAR NOVA DEMANDA
  const addDemand = async (demand: Omit<Demand, "id">): Promise<string | null> => { 
    
    const { data, error } = await supabase
          .from('demands')
          .insert(demand);

        if (error) {
          console.error('Erro ao adicionar demanda:', error.message);          
          return null;
        }
       
    //busca do id da demanda que acabou de ser inserida
    const { data: demandRow, error: fetchError } = await supabase
          .from("demands")
          .select("id")
          .eq("codUnico", demand.codUnico)
          .eq("laundry_id",user?.laundryId)
          .single();

        if (fetchError) {
          console.error("Erro ao recuperar id da demanda:", fetchError.message);
          return null;
        }  

    setDemands(prev => [...prev, ...(data || [])]);
    return demandRow.id;

  };

  //ATUALIZAR A DEMANDA
  const updateDemand = async (id: string, updates: Partial<Demand>) => {    

    //console.log("UPDATES", updates);
    const { data, error } = await supabase
      .from('demands')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao atualizar demanda:', error.message);
      return;
    }
  

    //EXCLUSÃO DE CATEGORIAS
    const { data:categorias, error:categoriaError } = await supabase
      .from('demand_category')
      .update({ status: 'dtv' })
      .eq('demand_id', id)
      .eq('status', 'atv');

      //console.log("categorias", categorias);
    if (categoriaError) {
      console.error('Erro ao atualizar CATEGORIAS DA demanda:', categoriaError.message);
      return;
    }
   

    //INCLUIR NOVAS CATEGORIAS
    if (updates.category && updates.category.length > 0) {
      const { data: categoriesData, error } = await supabase
        .from('categories')
        .select('id, name')
        .in('id', updates.category);

        if (error) {
          console.error("Erro ao buscar categorias:", error.message);
          return;
        }
        
        const { data: categories } = await supabase
        .from("categories")
        .select("id, name");

        const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.name]));

        const newCategories = updates.category.map(catId => ({
          demand_id: id,
          category: categoryMap[catId] ,
          status: 'atv'
        }));
     
        const { data: inserted, error: insertError } = await supabase
          .from('demand_category')
          .insert(newCategories);

        if (insertError) {
          console.error('Erro ao incluir novas categorias:', insertError.message);
          return;
        }

      
    }

    //vetor
    setDemands(prev =>
      prev.map(d => (d.id === id ? { ...d, ...updates, updated_at: new Date() } : d))
    );
    
  };

  const deleteDemand = async (id: string) => {
    const { error } = await supabase.from('demands').delete().eq('id', id);
    if (error) {
      console.error('Erro ao deletar demanda:', error.message);
      return;
    }
    setDemands(prev => prev.filter(d => d.id !== id));
  };

  //EVENTO QUE ATUALIZA A DEMANDA
  /*const updateDemandStatus = (id: string, status: string) => {
    setDemands(prev => prev.map(d => d.id === id ? { ...d, status: status as any, updatedAt: new Date() } : d));

  };*/
  const updateDemandStatus = async (id: string, status: string) => {
  const { error, data } = await supabase
    .from('demands')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (!error && data) {
    setDemands(prev => prev.map(d => d.id === id ? data : d));
  }
};

  const getDemandsByStatus = (status: string) => {
    //console.log("FILTER ", demands.filter(d => d.status === status));
    //console.log("DEMANDA ----", demands)
     const tste = demands.filter(d => d.status === status);
     //console.log("TSTE ", tste)
     return tste;
  };

  const sendEmailNotification = (demand: Demand) => {
    //console.log('Sending email notification for demand:', demand.id);
    // Implementar email real, se necessário
  };

  /*const updateLaundrySettings = (settings: LaundrySettings) => {
    setLaundrySettings(settings);
  };*/

    //const addDemand = async (demand: Demand) => {
  //ADICIONAR NOVA DEMANDA
  const addCategories = async (demand_categories: Omit<Demand_category, "id">): Promise<string | null> => { 
      //console.log("TESTE CATEOGORI");
      const { data, error } = await supabase
          .from('demand_category')
          .insert(demand_categories);

        if (error) {
          console.error('Erro ao adicionar Categoria da demanda:', error.message);
         // console.log(demand_categories);
          return null;
        }

  };

  //ADICIONANDO 
  const addDemandPhotos = async (demand_photos: Omit<Demand_photos, "id">): Promise<string | null> => { 
      //console.log("TESTE CATEOGORI ", demand_photos);
      const { data, error } = await supabase
          .from('demand_photos')
          .insert(demand_photos);

        if (error) {
          console.error('Erro ao adicionar photos da demanda:', error.message);
         // console.log(demand_photos);
          return null;
        }

  };

   //ADICIONANDO OS PAGAMENTO 
  const addDemandPayment = async (demand_payment: Omit<Demand_payment, "id">): Promise<string | null> => { 
      //console.log("TESTE CATEOGORI ", demand_photos);
      const { data, error } = await supabase
          .from('demand_payment')
          .insert(demand_payment);

        if (error) {
          console.error('Erro ao adicionar forma de pagamento da demanda:', error.message);
         // console.log(demand_photos);
          return null;
        }

  };

  //RETORNAR AS CATEGORIAS
  const selectCategories =  async (): Promise<Category[] | null> => {  
      
      const { data, error } = await supabase
          .from("categories")
          .select("id, name, description, laundry_id,code,supply_unit,price")
          .eq("laundry_id",user?.laundryId);

        if (error) {
          console.error('Erro ao adicionar photos da demanda:', error.message);        
          return null;
        }

      return data;  

  };

  //RETORNAR AS CATEGORIAS
  const selectPayments =  async (): Promise<Payment_method[] | null> => {  
      
      const { data, error } = await supabase
          .from("paymentMethod")
          .select("id, payment, acronym, status, laundry_id")
          .eq("laundry_id",user?.laundryId);

        if (error) {
          console.error('Erro ao adicionar photos da demanda:', error.message);        
          return null;
        }

      return data;  

  };

  //
  

  return (
    <DemandContext.Provider value={{
      demands,
      addDemand,
      updateDemand,
      deleteDemand,
      updateDemandStatus,
      getDemandsByStatus,
      sendEmailNotification,   
      addCategories,
      addDemandPhotos,
      addDemandPayment,
      selectCategories,
      selectPayments
      //updateLaundrySettings
    }}>
      {children}
    </DemandContext.Provider>
  );
};


//EXPORTA A
export const useDemand = () => {
  const context = useContext(DemandContext);
  if (context === undefined) {
    throw new Error('useDemand must be used within a DemandProvider');
  }
  return context;
};

export const useDemands = useDemand;
