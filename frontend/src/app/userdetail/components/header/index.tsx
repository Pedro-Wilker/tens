"use client";

import Link from "next/link";
import styles from "./styles.module.scss";
import Image from "next/image";
import logoImg from "/public/logo_sfundo.png";
import { LogOutIcon } from "lucide-react";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "@/services/api";

interface User {
  role: "PROVIDER" | "CLIENT" | "ADMIN" | "SUPPORT" | "PROVIDERAWAIT";
  id: number; 
  name: string;
  services?: Service[];
}

interface Service {
  id: number; 
  name: string;
  description: string;
  price: string;
  category: {
    id: number; 
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("session="))
      ?.split("=")[1];

    if (token) {
      fetchUserRole(token);
    }
  }, []);

  async function fetchUserRole(token: string) {
    try {
      const response = await api.get("/detailuser", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Erro ao buscar role do usuário:", error);
      setUser(null);
    }
  }

  async function handleBecomeProvider() {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("session="))
        ?.split("=")[1];

      if (!token) throw new Error("Token não encontrado");
      if (!user?.id) throw new Error("ID do usuário não disponível");

      await api.post("/createrole", {
        roleSelection: "PROVIDER",
        userId: user.id,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Sua solicitação foi enviada com sucesso");
      setError(null);

      setTimeout(() => {
        window.location.href = "https://wa.me/5574981054996?text=Olá,%20desejo%20fazer%20parte%20dos%20prestadores%20de%20serviços%20da%20TENS";
        setIsClientModalOpen(false);
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao enviar solicitação de role:", error);
      setError(error.response?.data?.error || "Erro ao processar sua solicitação. Tente novamente.");
    }
  }

  async function handleLogout() {
    deleteCookie("session", { path: "/" });
    router.replace("/");
  }

  const handleServiceClick = (service: Service) => {
    router.push(`/service-details/${service.id}`);
  };

  if (!user) {
    return null;
  }

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/services">
          <Image
            src={logoImg}
            alt="Logo"
            className={styles.logo}
            quality={100}
          />
        </Link>

        <nav>
          {user.role === "ADMIN" || user.role === "SUPPORT" ? (
            <>
              <Link href="/dashboard">Painel Admin</Link>
              <Link href="/services">Categorias</Link>
              <form action={handleLogout}>
                <button type="submit">
                  <LogOutIcon size={24} color="#ffde00" />
                </button>
              </form>
            </>
          ) : user.role === "PROVIDER" ? (
            <>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsProviderModalOpen(true);
                }}
              >
                Meus Serviços
              </Link>
              <Link href="/services">Categorias</Link>
              <form action={handleLogout}>
                <button type="submit">
                  <LogOutIcon size={24} color="#ffde00" />
                </button>
              </form>
            </>
          ) : user.role === "CLIENT" || user.role === "PROVIDERAWAIT" ? (
            <>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsClientModalOpen(true);
                }}
              >
                Seja TENS
              </Link>
              <Link href="/services">Categorias</Link>
              <form action={handleLogout}>
                <button type="submit">
                  <LogOutIcon size={24} color="#ffde00" />
                </button>
              </form>
            </>
          ) : null}
        </nav>
      </div>

      {isProviderModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsProviderModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Meus Serviços</h2>
            {user.services && user.services.length > 0 ? (
              <div className={styles.servicesList}>
                {user.services.map((service) => (
                  <div
                    key={service.id}
                    className={styles.serviceItem}
                    onClick={() => handleServiceClick(service)}
                    style={{ cursor: "pointer" }}
                  >
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noServices}>
                <p>Você não possui serviços cadastrados.</p>
              </div>
            )}
            <Link
              href={`/create-service?userId=${user.id}`}
              className={styles.createServiceButton}
            >
              Criar Serviço
            </Link>
          </div>
        </div>
      )}

      {isClientModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsClientModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Seja TENS</h2>
            <p>Deseja tornar-se um provedor de serviço na TENS?</p>
            {successMessage ? (
              <div className={styles.successMessage}>
                <p>{successMessage}</p>
              </div>
            ) : (
              <div className={styles.modalButtons}>
                <button className={styles.confirmButton} onClick={handleBecomeProvider}>
                  Desejo
                </button>
                <button className={styles.cancelButton} onClick={() => setIsClientModalOpen(false)}>
                  Cancelar
                </button>
              </div>
            )}
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
      )}
    </header>
  );
}