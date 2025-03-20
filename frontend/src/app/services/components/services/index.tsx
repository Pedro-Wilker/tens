"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./services.module.scss";
import { api } from "@/services/api";
import { useSearchParams } from "next/navigation";
import { useCategory } from "@/app/context/CategoryContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ServiceDetail {
  id: number;
  photoUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  provider: { id: number; name: string };
  subcategory: { id: number; name: string };
  averageRating: number;
  serviceDetails: ServiceDetail[];
}

interface Props {
  initialServices: Service[];
}

export default function Services({ initialServices }: Props) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [categoryName, setCategoryName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const { categoryId, subcategoryId } = useCategory();
  const router = useRouter();

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/allservices");
      if (Array.isArray(response.data)) {
        setServices(response.data);
        setError(null);
        setCategoryName("");
      } else {
        console.error(
          "Dados de serviços não estão no formato esperado (esperado: array):",
          response.data
        );
        setError("Formato de dados inválido retornado pelo servidor.");
        setServices([]);
      }
    } catch (err: any) {
      console.error(
        "Erro ao carregar serviços em https://tensoportunidades.com.br:8080/allservices (client-side):",
        {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          config: err.config,
        }
      );
      setError(
        "Erro ao carregar serviços. Verifique sua conexão ou tente novamente mais tarde."
      );
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchServicesByCategory = useCallback(async (categoryId: number) => {
    if (!categoryId) {
      setError("ID da categoria não fornecido.");
      return;
    }
    try {
      setLoading(true);
      const [servicesResponse, categoryResponse] = await Promise.all([
        api.get(`/services/category/${categoryId}`),
        api.get(`/categories/${categoryId}`),
      ]);
      if (Array.isArray(servicesResponse.data)) {
        setServices(servicesResponse.data);
        setCategoryName(categoryResponse.data.name);
        setError(null);
      } else {
        console.error(
          "Dados de serviços não estão no formato esperado (esperado: array):",
          servicesResponse.data
        );
        setError("Formato de dados inválido retornado pelo servidor.");
        setServices([]);
      }
    } catch (err: any) {
      console.error(
        `Erro ao carregar serviços da categoria em https://tensoportunidades.com.br:8080/services/category/${categoryId} (client-side):`,
        {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          config: err.config,
        }
      );
      setError(
        "Erro ao carregar serviços da categoria. Verifique sua conexão ou tente novamente mais tarde."
      );
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchServicesBySubcategory = useCallback(async (subcategoryId: number) => {
    if (!subcategoryId) {
      setError("ID da subcategoria não fornecido.");
      return;
    }
    try {
      setLoading(true);
      const [servicesResponse, subcategoryResponse] = await Promise.all([
        api.get(`/services/subcategory/${subcategoryId}`),
        api.get(`/subcategories/${subcategoryId}`),
      ]);
   
      if (Array.isArray(servicesResponse.data)) {
        setServices(servicesResponse.data);
        setCategoryName(subcategoryResponse.data.name);
        setError(null);
      } else {
        console.error(
          "Dados de serviços não estão no formato esperado (esperado: array):",
          servicesResponse.data
        );
        setError("Formato de dados inválido retornado pelo servidor.");
        setServices([]);
      }
    } catch (err: any) {
      console.error(
        `Erro ao carregar serviços da subcategoria em https://tensoportunidades.com.br:8080/services/subcategory/${subcategoryId} (client-side):`,
        {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          config: err.config,
        }
      );
      setError(
        "Erro ao carregar serviços da subcategoria. Verifique sua conexão ou tente novamente mais tarde."
      );
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setError("Digite uma categoria ou subcategoria para buscar.");
      return;
    }

    const searchTerm = categoryName.trim().toLowerCase();
    const encodedSearch = encodeURIComponent(searchTerm);
    console.log("Buscando por:", encodedSearch);
    setLoading(true);
    setError(null);
    setServices([]);

    try {
      const categoryResponse = await api.get(`/categories/name/${encodedSearch}`);
      if (categoryResponse.data?.services?.length > 0) {
        setServices(categoryResponse.data.services);
        setCategoryName(categoryResponse.data.name);
        setLoading(false);
        return;
      }
    } catch (err: any) {
      console.error(
        `Erro ao buscar categoria em https://tensoportunidades.com.br:8080/categories/name/${encodedSearch} (client-side):`,
        {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          config: err.config,
        }
      );
    }

    try {
      const subcategoryResponse = await api.get(`/subcategories/name/${encodedSearch}`);
      
      if (subcategoryResponse.data && Array.isArray(subcategoryResponse.data)) {
        const allServices = subcategoryResponse.data.flatMap((sub: any) => sub.services || []);
        if (allServices.length > 0) {
          setServices(allServices);
          setCategoryName(subcategoryResponse.data[0]?.name || searchTerm);
          setLoading(false);
          return;
        }
        console.log("Nenhum serviço encontrado na subcategoria.");
      }
    } catch (err: any) {
      console.error(
        `Erro ao buscar subcategoria em https://tensoportunidades.com.br:8080/subcategories/name/${encodedSearch} (client-side):`,
        {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          config: err.config,
        }
      );
    }

    setError("Categoria ou subcategoria não encontrada ou sem serviços associados.");
    setServices([]);
    setLoading(false);
  };

  useEffect(() => {
    const idFromParams = searchParams.get("categoryId");
    const parsedIdFromParams = idFromParams ? parseInt(idFromParams, 10) : null;
    const finalCategoryId = categoryId ?? parsedIdFromParams;

    if (subcategoryId) {
      fetchServicesBySubcategory(subcategoryId);
    } else if (finalCategoryId) {
      fetchServicesByCategory(finalCategoryId);
    } else {
      fetchServices();
    }
  }, [
    categoryId,
    subcategoryId,
    searchParams,
    fetchServices,
    fetchServicesByCategory,
    fetchServicesBySubcategory,
  ]);

  const handleServiceClick = (service: Service) => router.push(`/service-details?serviceId=${service.id}`);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) stars.push(<span key={i} className={styles.starFilled}>★</span>);
      else if (i === fullStars && hasHalfStar)
        stars.push(<span key={i} className={styles.starHalf}>★</span>);
      else stars.push(<span key={i} className={styles.starEmpty}>☆</span>);
    }
    return stars;
  };

  const getImageUrl = (photoUrl: string | null): string => {
    if (!photoUrl || photoUrl.trim() === "") return "/placeholder.webp";
    const baseUrl = "https://tensoportunidades.com.br/uploads/";
    const fallbackUrl = process.env.NEXT_PUBLIC_API_URL || "https://tensoportunidades.com.br:8080";
    const cleanPhotoUrl = photoUrl.startsWith("/uploads/")
      ? photoUrl.replace("/uploads/", "")
      : photoUrl;
    const apiImageUrl = `${fallbackUrl}/uploads/${cleanPhotoUrl}`;
    const directImageUrl = `${baseUrl}${cleanPhotoUrl}`;

    return directImageUrl || apiImageUrl;
  };

  return (
    <section className={styles.servicesSection}>
      <div className={styles.servicesContainer}>
        <h2 className={styles.servicesTitle}>Encontre o Serviço Perfeito</h2>
        <p className={styles.servicesSubtitle}>
          Conecte-se com profissionais locais para atender às suas necessidades.
        </p>
        <div className={styles.servicesSearchForm}>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Pesquise por categoria ou subcategoria (ex.: Restaurantes, Limpeza)"
              className={styles.servicesSearchInput}
            />
            <button type="submit" className={styles.servicesSearchButton}>
              Buscar
            </button>
          </form>
        </div>
        <div className={styles.servicesGrid}>
          {loading ? (
            <p className={styles.servicesLoading}>Carregando serviços...</p>
          ) : error ? (
            <p className={styles.servicesError}>{error}</p>
          ) : services.length > 0 ? (
            services.map((service) => (
              <div
                key={service.id}
                className={styles.serviceCard}
                onClick={() => handleServiceClick(service)}
              >
                {service.serviceDetails && service.serviceDetails.length > 0 ? (
                  <div className={styles.serviceCarousel}>
                    <ServiceImagesCarousel
                      images={service.serviceDetails.map((detail) => getImageUrl(detail.photoUrl))}
                    />
                  </div>
                ) : (
                  <div className={styles.serviceImageContainer}>
                    <Image
                      src="/placeholder.webp"
                      alt={service.name}
                      width={300}
                      height={200}
                      style={{ objectFit: "cover" }}
                      className={styles.serviceImage}
                      loading="lazy"
                    />
                    <div className={styles.imageOverlay}></div>
                  </div>
                )}
                <div className={styles.serviceContent}>
                  <h3 className={styles.serviceName}>{service.name}</h3>
                  <p className={styles.providerName}>Provedor: {service.provider.name}</p>
                  <p className={styles.description}>{service.description}</p>
                  <div className={styles.rating}>{renderStars(service.averageRating)}</div>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noServices}>Nenhum serviço encontrado.</p>
          )}
        </div>
        <button onClick={() => fetchServices()} className={styles.refreshButton}>
          Voltar Para Todos Os Serviços
        </button>
      </div>
    </section>
  );
}

function ServiceImagesCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselImageContainer}>
        <Image
          src={images[currentIndex]}
          alt={`Imagem ${currentIndex + 1}`}
          width={300}
          height={200}
          style={{ objectFit: "cover" }}
          className={styles.carouselImage}
          loading="lazy"
          onError={(e) => {
            console.log(`Erro ao carregar imagem: ${images[currentIndex]}`);
            (e.target as HTMLImageElement).src = "/placeholder.webp";
          }}
        />
      </div>
    </div>
  );
}