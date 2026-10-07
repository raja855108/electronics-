import React, { useState, useEffect } from 'react';
import { getProductGraphicSvg } from '../utils/productImages.ts';

interface ProductImageProps {
  category: string;
  colorCode?: string;
  colorName?: string;
  productName?: string;
  src?: string;
  alt: string;
  className?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  category,
  colorCode = '#2563eb',
  colorName = 'Electric Blue',
  productName = '',
  src,
  alt,
  className = 'w-full h-full object-contain'
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  // If a custom image URL is provided and has not errored
  if (src && src.trim().length > 0 && !imageError) {
    return (
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setImageError(true)}
        className={className}
      />
    );
  }

  // High-fidelity procedural SVG vector graphic
  const svgMarkup = getProductGraphicSvg(category, colorCode, colorName, productName);

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden transition-all duration-300 ${className}`}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
      aria-label={alt}
    />
  );
};
