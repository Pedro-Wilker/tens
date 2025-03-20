"use client";

import styles from "./footer.module.scss";
import Image from "next/image";
import logoImg from "/public/logo_sfundo.png";
import { useMediaQuery } from "@mui/system";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const isMobile = useMediaQuery("(max-width: 1024px)");

  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <div className={styles.logoContainer}>
            <Image src={logoImg} alt="TENS Logo" className={styles.logo} />
            {!isMobile && (
              <p className={styles.footerText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            )}
          </div>
          <div className={styles.socialIcons}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook className={styles.socialIcon} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter className={styles.socialIcon} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram className={styles.socialIcon} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Linkedin className={styles.socialIcon} />
            </a>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Produtos</h3>
          <ul className={styles.footerList}>
            <li><a href="/about/profissional" className={styles.footerLink}>Produtos</a></li>
            <li><a href="/about/profissional" className={styles.footerLink}>Preços</a></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Compania</h3>
          <ul className={styles.footerList}>
            <li><a href="/about/about" className={styles.footerLink}>Quem somos</a></li>
            <li><p className={styles.footerLink}>Carreiras</p></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Suporte</h3>
          <ul className={styles.footerList}>
            <li><a href="/session/signup" className={styles.footerLink}>Comece aqui!</a></li>
            <li><a href="/about/profissional" className={styles.footerLink}>Profissionais</a></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Entre em contato</h3>
          <ul className={styles.footerList}>
            <li className={styles.footerLink}>
              📧 <a href="mailto:suport@tens.com">suport@tens.com</a>
            </li>
            <li className={styles.footerLink}>📞 +55 (74) 98105-4996</li>
          </ul>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p className={styles.footerCopyright}>© 2025 TENS. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}