"use client";

import styles from "./page.module.scss";
import Image from "next/image";
import logoImg from "/public/logo_sfundo.png";
import Link from "next/link";
import Footer from "../../components/footer/footer";
import { Menu, User, Users, FileText, ThumbsUp } from "lucide-react";
import { useState } from "react";

export default function QuemSomos() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/">
            <Image src={logoImg} alt="Logo" className={styles.logo} priority />
          </Link>
          <div className={styles.headerActions}>
            <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
              <Link href="/">TENS</Link>
              <Link href="/about/profissional">Seja um Profissional</Link>
              <Link href="/services">Serviços</Link>
            </nav>
            <button
              className={styles.hamburger}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <Menu className={styles.menuIcon} />
            </button>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <section className={styles.platformSummary}>
          <div className={styles.platformSummaryContainer}>
            <h1 className={styles.platformSummaryTitle}>
              <span style={{ color: "#ffde00" }}>T</span><b>apiramutá</b><br />
              <span style={{ color: "#ff51d6" }}>E</span><b>mpreendedorismo</b><br />
              <span style={{ color: "#ffff" }}>N</span><b>egócios</b><br />
              <span style={{ color: "#baabf6" }}>S</span><b>oluções</b>
            </h1>
          </div>
          <div className={styles.platformSummaryTextContainer}>
            <div className={styles.platformSummarySubtitle}>
              <p>Nascemos para unir quem precisa de serviços em Tapiramutá e região com quem sabe fazê-los. Somos o espaço onde pequenos empreendedores locais divulgam seus trabalhos, conectando-se a clientes de forma prática e segura.</p>
              <p>Nossa plataforma cria uma ponte entre clientes e profissionais, promovendo soluções diárias para a comunidade de Tapiramutá e arredores.</p>
            </div>
          </div>
        </section>
        <section className={styles.missionVision}>
          <div className={styles.missionVisionContent}>
            <div className={styles.missionVisionGrid}>
              <div className={styles.missionVisionCard}>
                <h3 className={styles.missionVisionTitle}>Missão</h3>
                <p className={styles.missionVisionText}>
                  Conectar moradores de Tapiramutá e região a serviços locais, apoiando pequenos empreendedores com divulgação segura e rápida, dinamizando a economia local.
                </p>
              </div>
              <div className={styles.missionVisionCard}>
                <h3 className={styles.missionVisionTitle}>Visão</h3>
                <p className={styles.missionVisionText}>
                  Empoderar empreendedores locais para alcançarem independência e expandirem sua clientela em Tapiramutá e arredores.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.values}>
          <h2 className={styles.valuesTitle}>Nossos Valores</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valuesCard}>
              <FileText size={60} color="#ffde00" />
              <h3 className={styles.valuesCardTitle}>Comunidade</h3>
              <p className={styles.valuesCardText}>Apoiar o bem-estar de Tapiramutá.</p>
            </div>
            <div className={styles.valuesCard}>
              <Users size={60} color="#ffde00" />
              <h3 className={styles.valuesCardTitle}>Qualidade</h3>
              <p className={styles.valuesCardText}>Garantir serviços excepcionais.</p>
            </div>
            <div className={styles.valuesCard}>
              <ThumbsUp size={60} color="#ffde00" />
              <h3 className={styles.valuesCardTitle}>Soluções</h3>
              <p className={styles.valuesCardText}>Resolver necessidades locais.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}