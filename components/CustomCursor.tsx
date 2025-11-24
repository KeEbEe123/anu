'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      
      // Get computed cursor style
      const computedStyle = window.getComputedStyle(target);
      const cursorStyle = computedStyle.cursor;
      
      // Check if element or any parent has grab/pointer cursor or is interactive
      const isInteractive = 
        cursorStyle === 'grab' ||
        cursorStyle === 'grabbing' ||
        cursorStyle === 'pointer' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer') ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.style.cursor === 'grab' ||
        target.style.cursor === 'grabbing' ||
        target.style.cursor === 'pointer';

      setIsPointer(!!isInteractive);
    };

    const animate = () => {
      // Smooth cursor movement with easing
      const speed = 0.2;
      cursorX += (mouseX - cursorX) * speed;
      cursorY += (mouseY - cursorY) * speed;

      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[10000]"
      style={{
        width: '56px',
        height: '56px',
        willChange: 'transform',
      }}
    >
      <img
        src={isPointer ? '/grab.png' : '/normal.png'}
        alt=""
        className="w-full h-full"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
}
