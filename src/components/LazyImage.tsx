import { useState, useEffect, useRef, memo } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const LazyImage = memo(({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3C/svg%3E',
  onError 
}: LazyImageProps) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isInView) return;

    // Optimize image URL
    let optimizedSrc = src;
    if (src && !src.startsWith('data:') && !src.startsWith('http://localhost:5000')) {
      // Add width parameter if provided
      if (width) {
        const url = new URL(src, window.location.origin);
        url.searchParams.set('w', width.toString());
        url.searchParams.set('q', '80'); // Quality
        optimizedSrc = url.toString();
      }
    }

    // Preload image
    const img = new Image();
    img.onload = () => {
      setImageSrc(optimizedSrc);
      setIsLoaded(true);
    };
    img.onerror = () => {
      if (onError) {
        const syntheticEvent = {
          currentTarget: imgRef.current,
        } as React.SyntheticEvent<HTMLImageElement, Event>;
        onError(syntheticEvent);
      }
    };
    img.src = optimizedSrc;
  }, [isInView, src, width, onError]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onError={onError}
      style={{
        willChange: isLoaded ? 'auto' : 'opacity',
      }}
    />
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;

