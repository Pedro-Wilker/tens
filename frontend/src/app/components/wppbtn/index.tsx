"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./floating-whatsapp-button.module.scss";
import logoImg from "/public/wpplogo.png";

export default function FloatingWhatsAppButton() {
  const router = useRouter();

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Olá, gostaria de saber mais sobre a TENS");
    const whatsappUrl = `https://wa.me/5574981054996?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className={styles.floatingButton} onClick={handleWhatsAppClick}>
      <Image
        src={logoImg}
        alt="Fale conosco pelo WhatsApp"
        width={70}
        height={70}
        className={styles.logo}
      />
    </div>
  );
}