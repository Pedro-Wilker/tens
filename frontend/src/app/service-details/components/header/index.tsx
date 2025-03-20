"use client";

import Link from "next/link";
import styles from "./styles.module.scss";
import Image from "next/image";
import logoImg from "/public/logo_sfundo.png";
import { LogOutIcon, UserIcon, Menu } from "lucide-react";
import { deleteCookie } from "cookies-next";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "@/services/api";

interface User {
  role: "PROVIDER" | "CLIENT" | "ADMIN" | "SUPPORT" | "PROVIDERAWAIT";
  id: number;
  name: string;
  email: string;
  number: string;
  analfabeto: boolean;
  services?: Service[];
}

interface ServiceDetail {
  id: number;
  serviceId: number;
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
  category?: { id: number; name: string };
  subcategory?: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
  serviceDetails?: ServiceDetail[];
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname(); 
  const [user, setUser] = useState<User | null>(null);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const response = await api.get("/detailuser"); 
      console.log("Dados do usuário buscados com sucesso de https://tensoportunidades.com.br:8080/detailuser:", {
        status: response.status,
        data: response.data,
      });
      setUser(response.data);
    } catch (error: any) {
      console.error("Erro ao buscar dados do usuário em https://tensoportunidades.com.br:8080/detailuser:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setUser(null);
    }
  };

  const fetchUserServices = async () => {
    try {
      const response = await api.get("/listdetailuser"); 
      console.log("Dados completos do usuário buscados com sucesso de https://tensoportunidades.com.br:8080/listdetailuser:", {
        status: response.status,
        data: response.data,
      });
      setUser(response.data);
    } catch (error: any) {
      console.error("Erro ao buscar serviços do usuário em https://tensoportunidades.com.br:8080/listdetailuser:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setUser((prev) => ({ ...prev, services: [] } as User));
    }
  };

  useEffect(() => {
    console.log("Iniciando verificação de usuário no Header...");
    fetchUser();
  }, [pathname]); 

  const normalizeImageUrl = (photoUrl: string): string => {
    if (!photoUrl || photoUrl.trim() === "") return "/placeholder.webp";
    const baseUrl = "https://tensoportunidades.com.br/uploads/";
    const fallbackUrl = process.env.NEXT_PUBLIC_API_URL || "https://tensoportunidades.com.br:8080";
    return photoUrl.startsWith("http") ? photoUrl : `${baseUrl}${photoUrl}` || `${fallbackUrl}/uploads/${photoUrl}`;
  };

  async function handleBecomeProvider() {
    try {
      if (!user?.id) throw new Error("ID do usuário não encontrado");
      const response = await api.post("/createrole", { roleSelection: "PROVIDER", userId: user.id });
      console.log("Solicitação de provedor enviada com sucesso para https://tensoportunidades.com.br:8080/createrole:", {
        status: response.status,
        data: response.data,
      });
      setSuccessMessage("Solicitação enviada com sucesso!");
      setTimeout(() => {
        window.location.href = "https://wa.me/5574981054996?text=Olá,%20desejo%20fazer%20parte%20dos%20prestadores%20de%20serviços%20da%20TENS";
        setIsClientModalOpen(false);
      }, 1500);
    } catch (error: any) {
      console.error("Erro ao processar solicitação de provedor em https://tensoportunidades.com.br:8080/createrole:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setError("Erro ao processar sua solicitação. Tente novamente.");
    }
  }

  async function handleLogout() {
    deleteCookie("session", { path: "/" });
    setUser(null);
    router.replace("/");
  }

  const handleServiceClick = (service: Service) => router.push(`/service-details/${service.id}`);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href={user ? "/services" : "/"}>
          <Image src={logoImg} alt="Logo" className={styles.logo} quality={100} />
        </Link>

        {user ? (
          <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
            {user.role === "ADMIN" || user.role === "SUPPORT" ? (
              <>
                <Link href="/dashboard">Painel Admin</Link>
                <Link href="/userdetail" className={styles.profileLink}>
                  <span className={styles.profileBox}><UserIcon size={20} color="#ffde00" /></span>
                </Link>
                <form action={handleLogout}><button type="submit"><LogOutIcon size={24} color="#ffde00" /></button></form>
              </>
            ) : user.role === "PROVIDER" ? (
              <>
                <Link href="#" onClick={(e) => { e.preventDefault(); setIsProviderModalOpen(true); fetchUserServices(); }}>Meus Serviços</Link>
                <Link href="/userdetail" className={styles.profileLink}>
                  <span className={styles.profileBox}><UserIcon size={20} color="#ffde00" /></span>
                </Link>
                <form action={handleLogout}><button type="submit"><LogOutIcon size={24} color="#ffde00" /></button></form>
              </>
            ) : user.role === "CLIENT" || user.role === "PROVIDERAWAIT" ? (
              <>
                <Link href="#" onClick={(e) => { e.preventDefault(); setIsClientModalOpen(true); }}>Seja TENS</Link>
                <Link href="/userdetail" className={styles.profileLink}>
                  <span className={styles.profileBox}><UserIcon size={20} color="#ffde00" /></span>
                </Link>
                <form action={handleLogout}><button type="submit"><LogOutIcon size={24} color="#ffde00" /></button></form>
              </>
            ) : null}
          </nav>
        ) : (
          <div className={styles.headerActions}>
            <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
              <Link href="/about/about">Quem Somos</Link>
              <Link href="/about/profissional">Seja um Profissional</Link>
              <Link href="/services">Serviços</Link>
            </nav>
            <Link href="/session/sign" className={styles.login}><UserIcon size={20} color="#ffde00" /> Entrar</Link>
            <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle menu"><Menu size={24} color="#ffde00" /></button>
          </div>
        )}
      </div>

      {isProviderModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsProviderModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Meus Serviços</h2>
            {user?.services && user.services.length > 0 ? (
              <div className={styles.servicesList}>
                {user.services.map((service) => (
                  <div key={service.id} className={styles.serviceItem} onClick={() => handleServiceClick(service)} style={{ cursor: "pointer" }}>
                    {service.serviceDetails && service.serviceDetails.length > 0 && (
                      <Image
                        src={normalizeImageUrl(service.serviceDetails[0].photoUrl)}
                        alt={`Imagem do serviço ${service.name}`}
                        width={100}
                        height={100}
                        quality={100}
                        style={{ objectFit: "cover" }}
                        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.webp"; }}
                      />
                    )}
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    {service.subcategory && <p><strong>Subcategoria:</strong> {service.subcategory.name}</p>}
                    <p><strong>Preço:</strong> R$ {service.price}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noServices}><p>Você não possui serviços cadastrados.</p></div>
            )}
            <Link href={`/create-service?userId=${user?.id}`} className={styles.createServiceButton}>Criar Serviço</Link>
          </div>
        </div>
      )}

      {isClientModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsClientModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Seja TENS</h2>
            <p>Deseja tornar-se um provedor de serviço na TENS?</p>
            {successMessage ? (
              <div className={styles.successMessage}><p>{successMessage}</p></div>
            ) : (
              <div className={styles.modalButtons}>
                <button className={styles.confirmButton} onClick={handleBecomeProvider}>Desejo</button>
                <button className={styles.cancelButton} onClick={() => setIsClientModalOpen(false)}>Cancelar</button>
              </div>
            )}
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
      )}
    </header>
  );
}