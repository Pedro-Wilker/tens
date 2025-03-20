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
}

export function CreateServiceHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  useEffect(() => {
    console.log("Iniciando verificação de usuário no CreateServiceHeader...");
    fetchUser();
  }, [pathname]);

  async function handleLogout() {
    deleteCookie("session", { path: "/" });
    setUser(null);
    router.replace("/");
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  if (!user || user.role !== "PROVIDER") {
    return null; 
  }

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/services">
          <Image src={logoImg} alt="Logo TENS" className={styles.logo} quality={100} priority sizes="(max-width: 768px) 100px, 160px" />
        </Link>

        <button className={styles.menuToggle} onClick={toggleMenu}>
          <Menu size={28} color="#ffde00" />
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
          <Link href="/services">Voltar para Serviços</Link>
          <Link href="/userdetail" className={styles.profileLink}>
            <span className={styles.profileBox}><UserIcon size={20} color="#ffde00" /></span>
          </Link>
          <form action={handleLogout}>
            <button type="submit" aria-label="Sair"><LogOutIcon size={24} color="#ffde00" /></button>
          </form>
        </nav>
      </div>
    </header>
  );
}