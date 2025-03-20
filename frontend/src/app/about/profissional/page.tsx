"use client";

import styles from "./page.module.scss";
import Image from "next/image";
import logoImg from "/public/logo_sfundo.png";
import Link from "next/link";
import Footer from "../../components/footer/footer";
import { Menu, User, FileText, DollarSign, MessageSquare, Star, Users } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HowItWorksForProfessionals() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignupClick = () => {
    router.push("/session/signup");
  };

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
              <Link href="/about/about">Quem Somos</Link>
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
        <section className={styles.registration}>
          <div className={styles.registrationContent}>
            <h2 className={styles.registrationTitle}>Seja um Profissional em Tapiramutá</h2>
            <p className={styles.registrationSubtitle}>Aumente sua visibilidade na região!</p>
            <div className={styles.registrationSteps}>
              <div className={styles.stepCard}>
                <FileText size={60} color="#ffde00" />
                <h3 className={styles.stepTitle}>Cadastro</h3>
                <p className={styles.stepText}>Registre-se facilmente na plataforma.</p>
              </div>
              <div className={styles.stepCard}>
                <Users size={60} color="#ffde00" />
                <h3 className={styles.stepTitle}>Entrevista</h3>
                <p className={styles.stepText}>Validação com nosso suporte local.</p>
              </div>
              <div className={styles.stepCard}>
                <DollarSign size={60} color="#ffde00" />
                <h3 className={styles.stepTitle}>Serviços</h3>
                <p className={styles.stepText}>Defina os serviços que oferecerá.</p>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.benefits}>
          <div className={styles.benefitsContent}>
            <h2 className={styles.benefitsTitle}>Vantagens para Profissionais</h2>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitCard}>
                <h3 className={styles.benefitTitle}>Gratuito</h3>
                <p className={styles.benefitText}>Sem custos para se cadastrar ou usar.</p>
              </div>
              <div className={styles.benefitCard}>
                <h3 className={styles.benefitTitle}>Sem Pagamento</h3>
                <p className={styles.benefitText}>Negocie diretamente com clientes.</p>
              </div>
              <div className={styles.benefitCard}>
                <h3 className={styles.benefitTitle}>Sem Comissão</h3>
                <p className={styles.benefitText}>100% do seu ganho é seu.</p>
              </div>
            </div>
            <button className={styles.benefitsButton} onClick={handleSignupClick}>
              Cadastre-se Agora
            </button>
          </div>
        </section>
        <section className={styles.reviews}>
          <div className={styles.reviewsContent}>
            <h2 className={styles.reviewsTitle}>Feedback em Tapiramutá</h2>
            <div className={styles.reviewsGrid}>
              <div className={styles.reviewCard}>
                <MessageSquare size={60} color="#ffde00" />
                <h3 className={styles.reviewTitle}>Comentários</h3>
                <p className={styles.reviewText}>Deixe sua opinião sobre os serviços.</p>
              </div>
              <div className={styles.reviewCard}>
                <Star size={60} color="#ffde00" />
                <h3 className={styles.reviewTitle}>Avaliações</h3>
                <p className={styles.reviewText}>Nota dos profissionais por clientes.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}