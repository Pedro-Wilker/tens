"use client";

import { useState, useEffect, useRef } from "react";
import CarouselItem from "./carouselItem";
import styles from "@/app/page.module.scss";
import { StaticImageData } from "next/image";

import modaBelezaImg from "/public/carrossel/modaBeleza.jpg";
import alimentacaoImg from "/public/carrossel/alimentacao.jpg";
import festasEventosImg from "/public/carrossel/festasEventos.jpg";
import produtosRocaImg from "/public/carrossel/produtosRoca.jpg";
import artesanatosImg from "/public/carrossel/artesanatos.jpg";
import assistenciaTecnicaImg from "/public/carrossel/assistenciaTecnica.jpg";

interface CarouselProps {
  categories: { id: number; name: string; categoryId: number; image: StaticImageData }[];
}

const imageMap: Record<string, StaticImageData> = {
  "Alimentação": alimentacaoImg,
  "Artesanatos": artesanatosImg,
  "Assistência técnica": assistenciaTecnicaImg,
  "Festas e Eventos": festasEventosImg,
  "Moda e beleza": modaBelezaImg,
  "Produtos da roça": produtosRocaImg,
};

export default function Carousel({ categories }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const carouselTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setTranslateX(currentIndex * -100);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const diffX = clientX - startX;
    setTranslateX(currentIndex * -100 + (diffX / window.innerWidth) * 100);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = translateX - currentIndex * -100;
    if (diff > 30) prevSlide();
    else if (diff < -30) nextSlide();
    else setTranslateX(currentIndex * -100);
  };

  return (
    <>
      {isMobile ? (
        <div className={styles.carousel}>
      
          <div
            className={styles.carouselTrack}
            ref={carouselTrackRef}
            style={{ transform: `translateX(${isDragging ? translateX : currentIndex * -100}%)` }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            {categories.map((category) => (
              <CarouselItem
                key={category.id}
                name={category.name}
                image={category.image}
                categoryId={category.categoryId}
              />
            ))}
          </div>
      
          {/* Indicadores (dots) */}
          <div className={styles.carouselDots}>
            {categories.map((_, index) => (
              <span
                key={index}
                className={`${styles.carouselDot} ${currentIndex === index ? styles.activeDot : ""}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.carouselGrid}>
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              name={category.name}
              image={category.image}
              categoryId={category.categoryId}
            />
          ))}
        </div>
      )}
    </>
  );
}