"use client"; 

import { useState, useEffect } from "react";
import styles from "../page.module.scss";
import Image from "next/image";
import Link from "next/link";
import provider from "/public/provedores.jpg";
import providerMobile from "/public/provedores_mobile.png";

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

   
    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Transforme seu dia em Tapiramutá!</h1>
        <p className={styles.heroSubtitle}>
          Encontre ou ofereça serviços locais com facilidade e segurança.
        </p>
        <Link href="/session/sign" className={styles.heroButton}>
          Comece Agora
        </Link>
      </div>
      <div className={styles.heroImage}>
        <Image
          src={isMobile ? providerMobile : provider}
          alt="Serviços locais em Tapiramutá"
          fill
          quality={90}
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
    </section>
  );
}