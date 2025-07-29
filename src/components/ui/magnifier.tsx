import React, { useState, useRef, useEffect } from 'react';

interface MagnifierProps {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  magnifierRadius?: number;
  magnifierScale?: number;
}

export const Magnifier: React.FC<MagnifierProps> = ({
  src,
  alt,
  width = '100%',
  height = 'auto',
  magnifierRadius = 100,
  magnifierScale = 2,
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imgRef.current) return;

    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = e.pageX - left - window.scrollX;
    const y = e.pageY - top - window.scrollY;

    if (x < 0 || y < 0 || x > width || y > height) {
      setShowMagnifier(false);
      return;
    }

    setMousePosition({ x, y });
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const imageStyle: React.CSSProperties = {
    width,
    height,
    objectFit: 'contain',
    cursor: 'crosshair',
  };

  const magnifierStyle: React.CSSProperties = {
    position: 'absolute',
    pointerEvents: 'none',
    height: magnifierRadius * 2,
    width: magnifierRadius * 2,
    borderRadius: '50%',
    border: '2px solid #ccc',
    backgroundColor: 'white',
    backgroundImage: `url(${src})`,
    backgroundRepeat: 'no-repeat',
    top: mousePosition.y - magnifierRadius,
    left: mousePosition.x - magnifierRadius,
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
    display: showMagnifier ? 'block' : 'none',
    backgroundSize: `${imgRef.current ? imgRef.current.width * magnifierScale : 0}px ${imgRef.current ? imgRef.current.height * magnifierScale : 0}px`,
    backgroundPositionX: `${-mousePosition.x * magnifierScale + magnifierRadius}px`,
    backgroundPositionY: `${-mousePosition.y * magnifierScale + magnifierRadius}px`,
    zIndex: 10,
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        style={imageStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {showMagnifier && <div style={magnifierStyle} />}
    </div>
  );
};
