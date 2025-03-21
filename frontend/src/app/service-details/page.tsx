import { cookies } from "next/headers";
import { api } from "@/services/api";
import ServiceDetails from "./components/service-detail";
import { NextPage } from "next";

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  provider: {
    id: number;
    name: string;
    number: string;
    email: string;
    analfabeto: boolean;
  };
  subcategory: {
    id: number;
    name: string;
  };
  averageRating: number;
  serviceDetails: ServiceDetail[];
  comments: Comment[];
  ratings: Rating[];
  createdAt: string;
  updatedAt: string;
}

interface ServiceDetail {
  id: number;
  photoUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: number;
  text: string;
  user: {
    id: number;
    name: string;
  };
  createdAt: string;
  subcomments: Subcomment[];
}

interface Subcomment {
  id: number;
  text: string;
  user: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt?: string;
}

interface Rating {
  id: string;
  rating: number;
  user: {
    id: number;
    name: string;
  };
  createdAt: string;
}

interface BackendRating {
  id: number;
  rating: number;
  user: {
    id: number;
    name: string;
  };
  createdAt: string;
}

const ServiceDetailPage: NextPage<{ searchParams: Promise<{ serviceId?: string }> }> = async ({
  searchParams,
}) => {
  console.log("Iniciando execução do ServiceDetailPage...");

  const resolvedSearchParams = await searchParams;
  const serviceIdString = resolvedSearchParams.serviceId;

  if (!serviceIdString) {
    console.error("Nenhum serviceId fornecido na URL.");
    return <div>ID do serviço não fornecido.</div>;
  }

  const serviceId = parseInt(serviceIdString, 10);
  if (isNaN(serviceId) || serviceId <= 0) {
    console.error(`ID do serviço inválido: ${serviceIdString}`);
    return <div>ID do serviço inválido.</div>;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  console.log("Depuração do token:", {
    tokenExists: !!token,
    tokenValue: token || "Nenhum token encontrado",
    cookieStoreContent: cookieStore.getAll()
  });

  const apiConfig = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }) 
    }
  };

  let service: Service | null = null;

  try {
    console.log(`Iniciando requisição para https://tensoportunidades.com.br:8080/services/${serviceId}`);
    const serviceResponse = await api.get(`/services/${serviceId}`, apiConfig);

    console.log("Resposta da API recebida:", {
      status: serviceResponse.status,
      headers: serviceResponse.headers,
      data: serviceResponse.data
    });

    const backendService = serviceResponse.data;
    service = {
      ...backendService,
      ratings: backendService.ratings?.map((r: BackendRating) => ({
        id: r.id.toString(),
        rating: r.rating,
        user: {
          id: r.user?.id || 0,
          name: r.user?.name || "Usuário Anônimo",
        },
        createdAt: r.createdAt || new Date().toISOString(),
      })) || [],
      comments: backendService.comments || [],
      serviceDetails: backendService.serviceDetails || [],
    };
  } catch (err: any) {
    console.error(`Erro na requisição para https://tensoportunidades.com.br:8080/services/${serviceId}:`, {
      message: err.message,
      status: err.response?.status,
      responseData: err.response?.data,
      requestConfig: apiConfig
    });
    return <div>Erro ao carregar o serviço. Tente novamente mais tarde.</div>;
  }

  if (!service) {
    console.error(`Serviço com ID ${serviceId} não encontrado.`);
    return <div>Serviço não encontrado.</div>;
  }

  console.log("Renderizando ServiceDetails com dados:", {
    serviceId: service.id,
    serviceName: service.name,
    hasToken: !!token
  });

  return (
    <ServiceDetails
      initialService={service}
      initialDetails={service.serviceDetails}
      initialRatings={service.ratings}
      initialComments={service.comments}
      token={token}
    />
  );
};

export default ServiceDetailPage;