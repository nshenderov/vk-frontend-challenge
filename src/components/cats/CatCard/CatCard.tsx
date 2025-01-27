import { useEffect, useState } from 'react';

import { CatData } from '@/types';
import { favCatsIdb } from '@/store';
import { Image, Tooltip } from '@/components';
import cls from './CatCard.module.scss';

type CatCardProps = {
  cat: CatData;
  onRemoveCat?: (catId: string) => void;
};

export function CatCard({ cat, onRemoveCat }: CatCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null);

  useEffect(() => {
    favCatsIdb
      .hasCat(cat.id)
      .then(res => {
        setIsFavorite(res);
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }, [cat.id]);

  const handleClick = async () => {
    if (isFavorite) {
      try {
        await favCatsIdb.removeCat(cat.id);
        setIsFavorite(false);
        onRemoveCat?.(cat.id);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await favCatsIdb.saveCat(cat);
        setIsFavorite(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <figure className={`${cls['cat-card']} ${!isImageLoaded ? cls.loading : ''}`}>
      <Image
        src={cat.url}
        alt={`Cat ${cat.id}`}
        onLoad={() => {
          setIsImageLoaded(true);
        }}
      />

      {isImageLoaded && isFavorite !== null && (
        <div className={cls['favorite-icon-wrapper']} onClick={handleClick}>
          <FavoriteIcon isFavorite={isFavorite} />
        </div>
      )}
    </figure>
  );
}

export function FavoriteIcon({ isFavorite }: { isFavorite: boolean }) {
  return (
    <Tooltip tip={isFavorite ? `Убрать котика\nиз любимых` : `Добавить котика\nв любимые`}>
      <div className={`${cls['favorite-icon']} ${isFavorite ? cls.favorite : ''}`}>
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <g>
            <path d="M24 42.7L21.1 40.06C10.8 30.72 4 24.56 4 17C4 10.84 8.84 6 15 6C18.48 6 21.82 7.62 24 10.18C26.18 7.62 29.52 6 33 6C39.16 6 44 10.84 44 17C44 24.56 37.2 30.72 26.9 40.08L24 42.7Z" />
            <path d="M33 6C29.52 6 26.18 7.62 24 10.18C21.82 7.62 18.48 6 15 6C8.84 6 4 10.84 4 17C4 24.56 10.8 30.72 21.1 40.08L24 42.7L26.9 40.06C37.2 30.72 44 24.56 44 17C44 10.84 39.16 6 33 6ZM24.2 37.1L24 37.3L23.8 37.1C14.28 28.48 8 22.78 8 17C8 13 11 10 15 10C18.08 10 21.08 11.98 22.14 14.72H25.88C26.92 11.98 29.92 10 33 10C37 10 40 13 40 17C40 22.78 33.72 28.48 24.2 37.1Z" />
          </g>
        </svg>
      </div>
    </Tooltip>
  );
}
