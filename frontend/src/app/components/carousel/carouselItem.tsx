"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import styles from "../../page.module.scss";

interface CarouselItemProps {
  name: string;
  image: StaticImageData;
  categoryId: number;
}

export default function CarouselItem({ name, image, categoryId }: CarouselItemProps) {
  return (
    <Link href={`/services?categoryId=${categoryId}`} className={styles.carouselItem}>
      <div className={styles.carouselImageContainer}>
        <Image
          src={image}
          alt={name}
          fill
          style={{ objectFit: "cover" }}
          quality={80} 
          loading="lazy" 
        />
      </div>
      <h3 className={styles.carouselItemTitle}>{name}</h3>
      <p className={styles.carouselItemDescription}>
        Explore serviços em {name}
      </p>
    </Link>
  );
}