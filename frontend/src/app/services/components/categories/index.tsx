"use client";

import { useCategory } from "@/app/context/CategoryContext";
import styles from "./categories.module.scss";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";

export interface Subcategory {
  id: number;
  name: string;
}

export interface CategoriesProps {
  id: number;
  name: string;
  imageUrl: string | null;
  subcategories?: Subcategory[];
}

interface Props {
  categories: CategoriesProps[];
}

export default function Categories({ categories: initialCategories }: Props) {
  const { categoryId, setCategoryId, setSubcategoryId } = useCategory();
  const [categories, setCategories] = useState<CategoriesProps[]>(initialCategories);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubcategoryHovered, setIsSubcategoryHovered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar se é mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Função para buscar categorias dinamicamente (client-side)
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/categories");
 
      if (Array.isArray(response.data)) {
        const formattedCategories = response.data.map((category: CategoriesProps) => ({
          id: category.id,
          name: category.name,
          imageUrl: category.imageUrl && category.imageUrl.trim() !== "" ? category.imageUrl : null,
          subcategories: category.subcategories || [],
        }));
        setCategories(formattedCategories);
        setError(null);
      } else {
        console.error("Dados de categorias não estão no formato esperado (esperado: array):", response.data);
        setError("Formato de dados inválido retornado pelo servidor.");
        setCategories([]);
      }
    } catch (err: any) {
      console.error("Erro ao carregar categorias em https://tensoportunidades.com.br:8080/categories (client-side):", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config,
      });
      setError("Erro ao carregar categorias. Verifique sua conexão ou tente novamente mais tarde.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar categorias quando o componente for montado (se necessário)
  useEffect(() => {
    // Se as categorias iniciais forem vazias, buscar dinamicamente
    if (initialCategories.length === 0) {
      fetchCategories();
    }
  }, [initialCategories, fetchCategories]);

  const handleCategoryClick = (categoryId: number) => {
    if (isMobile) {
      setSelectedCategory(categoryId);
    } else {
      setCategoryId(categoryId);
      setSubcategoryId(null);
    }
  };

  const handleCategoryDoubleClick = (categoryId: number) => {
    if (isMobile) {
      setCategoryId(categoryId);
      setSubcategoryId(null);
      setSelectedCategory(null);
    } else {
      setCategoryId(categoryId);
      setSubcategoryId(null);
    }
  };

  const handleSubcategoryClick = (subcategoryId: number) => {
    setSubcategoryId(subcategoryId);
    setCategoryId(null);
    setSelectedCategory(null);
  };

  const handleMouseEnterCategory = (categoryId: number) => {
    if (!isMobile) {
      setHoveredCategoryId(categoryId);
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    }
  };

  const handleMouseLeaveCategory = () => {
    if (!isMobile && !isSubcategoryHovered) {
      const timeout = setTimeout(() => {
        setHoveredCategoryId(null);
      }, 2000);
      setTimeoutId(timeout);
    }
  };

  const handleMouseEnterSubcategory = () => {
    if (!isMobile) {
      setIsSubcategoryHovered(true);
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    }
  };

  const handleMouseLeaveSubcategory = () => {
    if (!isMobile) {
      setIsSubcategoryHovered(false);
      const timeout = setTimeout(() => {
        setHoveredCategoryId(null);
      }, 2000);
      setTimeoutId(timeout);
    }
  };

  const getImageUrl = (photoUrl: string | null): string => {
    if (!photoUrl || photoUrl.trim() === "") return "/placeholder.webp";
    if (photoUrl.startsWith("http")) return photoUrl;
    return `https://tensoportunidades.com.br/uploads/${photoUrl}`;
  };

  return (
    <>
      <section className={styles.headerSection}>
        <div className={styles.headerContainer}>
          <h2 className={styles.categoriesTitle}>Descubra Nossos Serviços</h2>
          <p className={styles.categoriesSubtitle}>
            Explore categorias incríveis e encontre os melhores profissionais para o que você precisa.
          </p>
        </div>
      </section>
      <section className={styles.categoriesSection}>
        <div className={styles.categoriesContainer}>
          {loading ? (
            <p className={styles.categoriesLoading}>Carregando categorias...</p>
          ) : error ? (
            <p className={styles.categoriesError}>{error}</p>
          ) : (
            <div className={isMobile ? styles.categoriesGrid : styles.categoriesRow}>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category.id} className={styles.categoryWrapper}>
                    <div
                      className={`${styles.categoryCard} ${categoryId === category.id ? styles.selected : ""}`}
                      onClick={() => handleCategoryClick(category.id)}
                      onDoubleClick={() => handleCategoryDoubleClick(category.id)}
                      onMouseEnter={() => handleMouseEnterCategory(category.id)}
                      onMouseLeave={handleMouseLeaveCategory}
                    >
                      <Image
                        src={getImageUrl(category.imageUrl)}
                        alt={`Imagem da categoria ${category.name}`}
                        width={50}
                        height={50}
                        quality={100}
                        className={styles.categoryImage}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.webp";
                        }}
                      />
                      <h3 className={styles.categoryName}>{category.name}</h3>
                    </div>
                    {(isMobile ? selectedCategory === category.id : hoveredCategoryId === category.id) && (
                      <div
                        className={isMobile ? styles.subcategoryMobileList : styles.subcategoryBox}
                        onMouseEnter={handleMouseEnterSubcategory}
                        onMouseLeave={handleMouseLeaveSubcategory}
                      >
                        <div className={styles.subcategoryHeader}>
                          <h3>{category.name}</h3>
                        </div>
                        <div className={styles.subcategoryContent}>
                          {category.subcategories && category.subcategories.length > 0 ? (
                            category.subcategories.map((subcategory) => (
                              <div
                                key={subcategory.id}
                                className={styles.subcategoryItem}
                                onClick={() => handleSubcategoryClick(subcategory.id)}
                              >
                                {subcategory.name}
                              </div>
                            ))
                          ) : (
                            <div className={styles.noSubcategories}>Nenhuma subcategoria disponível</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className={styles.noCategories}>Nenhuma categoria encontrada.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}