'use client';

import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import Image from 'next/image';
import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './case-gallery.module.css';

export function CaseGallery({ images, title }: { images: string[]; title: string }) {
  useEffect(() => {
    Fancybox.bind('[data-fancybox="case-gallery"]');
    return () => Fancybox.unbind('[data-fancybox="case-gallery"]');
  }, []);

  return (
    <Swiper className={styles.slider} modules={[Navigation, Pagination, A11y]} navigation pagination={{ clickable: true }} spaceBetween={20} slidesPerView={1} breakpoints={{ 700: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } }}>
      {images.map((image, index) => (
        <SwiperSlide key={`${image}-${index}`} className={styles.slide}>
          <a href={image} data-fancybox="case-gallery" data-caption={`${title} — фото ${index + 1}`} className={styles.link}>
            <Image src={image} alt={`${title}, фото ${index + 1}`} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" className={styles.image} />
          </a>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
