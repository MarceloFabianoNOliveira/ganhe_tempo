
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useDemand } from '@/contexts/DemandContext';
import { Demand, Demand_category, Demand_photos, Payment_method, Demand_payment } from '@/types/demand';
import { useAuth } from '@/contexts/AuthContext';
import { useLaundries } from '@/contexts/LaundryContext';
import { DemoPage } from '@/press/nota_fiscal/DemoPage'; 

export interface DemandFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  cpfCnpj: string;
  status: string
  description: string;
  price: string;
  discount: string;
  notes: string;
  photos: string[];
  categories: string[];
  payments: string[];
  owner: string;
  laundry_id: string;
  deliveryForecast: string;
  payment:string; 
  responsibles:string;
}

//salvar o arquivo no publico
async function salvarEmPublic(dataUrl: string, filename = "minha-imagem.png") {
  const res = await fetch("/public/clothes-clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataUrl, filename }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Falha ao salvar");
  return json.path as string; // ex.: /uploads/minha-imagem.png
}


export const useDemandForm = () => {
  const { addDemand, addCategories, addDemandPhotos, addDemandPayment, selectCategories, selectPayments } = useDemand();
  const { user } = useAuth();
  const { laundries } = useLaundries();

  const [formData, setFormData] = useState<DemandFormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    cpfCnpj: '',
    //category: '',
    status: '',
    description: '',
    price: '',
    discount: '',
    notes: '',
    photos: [],
    categories: [],
    payments:[],
    owner: user?.id,
    laundry_id: user?.laundryId,
    deliveryForecast: '',
    //payment_id: '',
    payment: '',
    responsibles: ''
  });
  

  const updateFormData = (field: keyof DemandFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addPhoto = (photo: string) => {
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, photo]
    }));
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };
  

  //NOVO MÉTODO DE CALCULO DE VALOR
  const toggleCategory = (categoryId: string) => {
  setFormData(prev => {
    let newCategories;
    //let novoPreco = prev.price ? parseFloat(prev.price) : 0;

    if (prev.categories.includes(categoryId)) {
        // Se já existe, remove
        newCategories = prev.categories.filter(id => id !== categoryId);
        //novoPreco = novoPreco - parseFloat(price);
        //console.log("Sub");

        //const valor = sessionStorage.getItem("precoTeste");
        //console.log("valor anterior", valor);
       // const valor_convertido = parseFloat(valor);
        //const subtracao = String(valor_convertido - parseFloat(price));
        //console.log("soma ", subtracao);
        //sessionStorage.setItem("precoTeste", String(subtracao));

    } else {
        // Se não existe, adiciona
        newCategories = [...prev.categories, categoryId];
       // novoPreco = novoPreco + parseFloat(price);
        
       // const valor = sessionStorage.getItem("precoTeste");
        //console.log("valor anterior", valor);
        //const valor_convertido = parseFloat(valor);
       // const soma = String(valor_convertido + parseFloat(price));
        //console.log("soma ", soma);
        //sessionStorage.setItem("precoTeste", String(soma));

      }

      return {
        ...prev,
        categories: newCategories,
        // price: String(novoPreco) // <-- Atualiza o campo price!
      };
  });

  
};


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {    
    
    e.preventDefault();
    
    if (!formData.clientName || !formData.clientPhone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }    

     
    //TIMESTAMP PARA GERAR O CODIGO UNICO
    const timestampAtual = Date.now();    

    const newDemand: Omit<Demand, "id"> = {
      client_name: formData.clientName,
      client_email: formData.clientEmail,
      client_phone: formData.clientPhone,
      cpf_cnpj: formData.cpfCnpj,
      //category: lista_servicos,
      description: formData.description,
      price: formData.price,
      discount: formData.discount,
      status: "novo",
      notes: formData.notes,
      created_at: new Date(),
      updated_at: new Date(),
      owner: formData.responsibles ?? "",                 // ✅ pega do Auth
      laundry_id: user?.laundryId ?? "",
      delivery_forecast: formData.deliveryForecast ? new Date(formData.deliveryForecast) : new Date(Date.now() ),
      //payment_id: formData.payment_id,      
      codUnico: timestampAtual.toString()
     
    };

    //console.log("NOVO SERVIÇO", newDemand);
    //funcao do demandContext
    const demandID = await addDemand(newDemand);
    
    if (!demandID) {
      // Tratar erro ou abortar fluxo
      console.error("USEDEMANDFORM - Falha ao criar demanda");
      return;
    }

    const test = await selectCategories(); //BUSCA LISTA DE CATEGORIAS DA EMPRESA
    //console.log("TESTETETETETET" , test);

    const categoryMap = Object.fromEntries(test.map(c => [c.id, c.name]));
      

    for (const cat of formData.categories) {
      //console.log("CATE ------", categoryMap[cat]);
   
      const newCat: Omit<Demand_category, "id"> = {
        status: "atv",
        category: categoryMap[cat],   // pega o nome/valor da categoria do vetor
        demand_id: demandID, // vem do insert da demanda
        category_id: cat
      };

      
      const novoId2 = await addCategories(newCat);
      //console.log("Categoria vinculada com ID:----", novoId2);

     
    }   
    
    //INCLUSÃO DAS IMAGENS EM TABELA SEPARADA

    for (const photo of formData.photos) {
      const newPhoto: Omit<Demand_photos, "id"> = {
        image: photo,
        demand_id: demandID,
        status: 'atv'
      };

      const novoId3 = await addDemandPhotos(newPhoto);
      //console.log("Foto vinculada com ID:----", novoId3);
      //const url = await salvarEmPublic(photo, "nota.png");

    }

    //inclusao de pagamentos
    console.log("TESTE PAY ",formData.payments)
      for (const pay of formData.payments) {
        console.log("PAY ------", pay);
        const newPay: Omit<Demand_payment, "id"> = {
          paymentMethod_id: pay,
          demand_id: demandID,
          status: 'atv'
      };

      const novoId3 = await addDemandPayment(newPay);
    }

    toast({
      title: "Demanda criada!",
      description: `Demanda para ${formData.clientName} foi criada com sucesso.`,
    });


    // opcional: pequena pausa pra deixar o toast aparecer
    setTimeout(() => {
      //window.location.reload();

      //APAGA OS DADOS DO
      sessionStorage.setItem("precoTeste", "0");
    }, 800);
    

    // Reset form
    setFormData({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      cpfCnpj: '',
      //category: '',
      status: '',
      description: '',
      price: '',
      discount: '',
      notes: '',
      photos: [],
      owner: user?.id,
      laundry_id: user?.laundryId,
      categories: [],
      payments: [],
      deliveryForecast: '',
      //payment_id: '',
      payment: '',
      responsibles: ''
    });

     //usar um esquema para fazer o refresh depois da insercao
    // window.location.reload();

    //Montar a impressão da Nota Fiscal

  };

 

  return {
    formData,
    updateFormData,
    handleSubmit,    
    addPhoto,
    removePhoto,
    toggleCategory
  };

};
