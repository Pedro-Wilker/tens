"use client";

import { useState } from "react";
import styles from "../page.module.scss";
import Image from "next/image";
import Link from "next/link";
import logoImg from "/public/logo_sfundo.png";
import { Menu } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
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
          <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle menu">
            <Menu className={styles.menuIcon} />
          </button>
        </div>
      </div>
    </header>
  );
}