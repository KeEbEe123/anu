'use client';

import { useEffect, useRef } from 'react';

export default function FallingHearts() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Store dimensions
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 120
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.x;
      mouse.y = e.y;
    };

    const handleResize = () => {
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      init();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const heartImage = new Image();
    heartImage.crossOrigin = 'anonymous';
    heartImage.src = 'https://i.ibb.co/N2KWM9HD/Group-8.png';
    let imageLoaded = false;

    heartImage.onload = () => {
      imageLoaded = true;
    };

    heartImage.onerror = () => {
      imageLoaded = true;
    };

    class Heart {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      rotation: number;
      rotationSpeed: number;
      velocityX: number;
      velocityY: number;
      opacity: number;

      constructor() {
        this.x = 0;
        this.y = 0;
        this.size = 0;
        this.speedY = 0;
        this.speedX = 0;
        this.rotation = 0;
        this.rotationSpeed = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.opacity = 0;
        this.reset();
        this.y = Math.random() * canvasHeight;
      }

      reset() {
        this.x = Math.random() * canvasWidth;
        this.y = -50;
        this.size = (Math.random() * 0.5 + 0.4) * 3;
        this.speedY = Math.random() * 1 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.velocityX = 0;
        this.velocityY = 0;
        this.opacity = Math.random() * 0.6 + 0.4;
      }

      update() {
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);

            this.velocityX += Math.cos(angle) * force * 2.5;
            this.velocityY += Math.sin(angle) * force * 2.5;
          }
        }

        this.x += this.speedX + this.velocityX;
        this.y += this.speedY + this.velocityY;

        this.velocityX *= 0.92;
        this.velocityY *= 0.92;

        this.rotation += this.rotationSpeed;

        if (this.y > canvasHeight + 50) {
          this.reset();
        }

        if (this.x < -50 || this.x > canvasWidth + 50) {
          this.x = Math.random() * canvasWidth;
        }
      }

      draw() {
        if (!imageLoaded || !ctx) return;

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const width = 50 * this.size;
        const height = 50 * this.size;
        ctx.drawImage(heartImage, -width / 2, -height / 2, width, height);

        ctx.restore();
      }
    }

    let heartsArray: Heart[] = [];

    function init() {
      heartsArray = [];
      const numberOfHearts = Math.floor((canvasWidth * canvasHeight) / 35000);
      for (let i = 0; i < numberOfHearts; i++) {
        heartsArray.push(new Heart());
      }
    }

    function animate() {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      for (let i = 0; i < heartsArray.length; i++) {
        heartsArray[i].update();
        heartsArray[i].draw();
      }

      requestAnimationFrame(animate);
    }

    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />
  );
}
