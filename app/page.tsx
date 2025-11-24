'use client';

import FallingHearts from '@/components/FallingHearts';
import DraggableNote from '@/components/DraggableNote';
import CustomCursor from '@/components/CustomCursor';
import BirthdayCake from '@/components/BirthdayCake';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function Home() {
  const textRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cakeTextRef = useRef<HTMLDivElement>(null);
  const cakeSectionRef = useRef<HTMLDivElement>(null);
  const nextSectionRef = useRef<HTMLDivElement>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [showCakeSection, setShowCakeSection] = useState(false);
  const [allCandlesBlown, setAllCandlesBlown] = useState(false);
  const blownWordsRef = useRef<Set<number>>(new Set());

  const blowRandomWord = () => {
    if (cakeTextRef.current && cakeTextRef.current.children.length > 0) {
      const words = Array.from(cakeTextRef.current.children);
      const availableIndices = words
        .map((_, index) => index)
        .filter(index => !blownWordsRef.current.has(index));
      
      if (availableIndices.length > 0) {
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        blownWordsRef.current.add(randomIndex);
        
        const word = words[randomIndex];
        const randomX = (Math.random() - 0.5) * 2000;
        const randomY = (Math.random() - 0.5) * 1000 - 500;
        const randomRotation = (Math.random() - 0.5) * 720;
        
        gsap.to(word, {
          x: randomX,
          y: randomY,
          rotation: randomRotation,
          opacity: 0,
          duration: 1.5,
          ease: 'power2.out',
        });
      }
    }
  };

  const handleAllCandlesBlown = () => {
    // Blow away any remaining words
    if (cakeTextRef.current && cakeTextRef.current.children.length > 0) {
      const words = Array.from(cakeTextRef.current.children);
      
      words.forEach((word, index) => {
        if (!blownWordsRef.current.has(index)) {
          const randomX = (Math.random() - 0.5) * 2000;
          const randomY = (Math.random() - 0.5) * 1000 - 500;
          const randomRotation = (Math.random() - 0.5) * 720;
          
          gsap.to(word, {
            x: randomX,
            y: randomY,
            rotation: randomRotation,
            opacity: 0,
            duration: 1.5,
            ease: 'power2.out',
          });
        }
      });
    }
    
    setAllCandlesBlown(true);
    setTimeout(() => {
      nextSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 1000);
  };

  const handleNoteOpen = () => {
    setNoteOpen(true);
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    }
  };

  useEffect(() => {
    if (textRef.current) {
      const text = textRef.current;
      const chars = text.textContent?.split('') || [];
      text.textContent = '';

      chars.forEach((char) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        text.appendChild(span);
      });

      // Find the index of 'y' in "Birthday" (position 14: "Happy Birthday")
      const yIndex = 5;
      const timeToY = yIndex * 0.05; // stagger delay * index
      
      // Create a timeline for both animations
      const tl = gsap.timeline();
      
      // First: Stagger character appearance
      tl.to(text.children, {
        opacity: 1,
        duration: 0.1,
        stagger: 0.05,
        ease: 'power2.inOut',
      });
      
      // Start scrolling when 'y' appears (at the calculated time)
      tl.to(text, {
        x: '-100%',
        duration: 20,
        ease: 'expo.in',
        repeat: -1,
        repeatDelay: 0,
      }, timeToY);
    }
  }, []);

  useEffect(() => {
    // Prevent scrolling until note is opened
    if (!noteOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [noteOpen]);

  useEffect(() => {
    if (!noteOpen) return;

    const handleScroll = () => {
      if (window.scrollY > 100 && !showCakeSection) {
        setShowCakeSection(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [noteOpen, showCakeSection]);

  useEffect(() => {
    if (showCakeSection && cakeTextRef.current) {
      const text = "Happy 20 years meri jaan, make a wish ( that you never leave me (obviously) ), and blow them candulss";
      const words = text.split(' ');
      
      cakeTextRef.current.innerHTML = '';
      
      words.forEach((word) => {
        const span = document.createElement('span');
        span.textContent = word;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        span.style.position = 'relative';
        span.style.marginRight = '0.5em';
        cakeTextRef.current?.appendChild(span);
      });

      gsap.to(cakeTextRef.current.children, {
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }
  }, [showCakeSection]);

  return (
    <>
      <CustomCursor />
      <FallingHearts />
      <div className="relative">
        <div className="flex items-center justify-center min-h-screen overflow-hidden">
          <div ref={containerRef} className="overflow-hidden whitespace-nowrap">
            <h1
              ref={textRef}
              className="text-[200px] text-black z-50 font-[family-name:var(--font-cedarville-cursive)] inline-block"
            >
              Happy Birthday Anushkaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa``
            </h1>
          </div>
        </div>
        <DraggableNote onOpen={handleNoteOpen} />
        
        {noteOpen && !showCakeSection && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center z-[9999] animate-bounce">
            <p className="text-3xl text-black font-[family-name:var(--font-covered-by-your-grace)] mb-2 text-center">
              scroll down, dont pull the note away
            </p>
            <svg 
              className="w-12 h-12 text-black" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        )}
      </div>
      
      {noteOpen && (
        <div ref={cakeSectionRef} className="min-h-screen pt-20 px-8 relative">
          {showCakeSection && (
            <>
              <div 
                ref={cakeTextRef}
                className="text-5xl text-black font-[family-name:var(--font-covered-by-your-grace)] mb-16 max-w-6xl leading-relaxed"
              >
                Happy 20 years meri jaan, make a wish ( that you never leave me (obviously) ), and blow the candlesss
              </div>
              
              <div className="flex justify-center items-end" style={{ height: 'calc(100vh - 400px)' }}>
                <div style={{ transform: 'scale(2)', transformOrigin: 'center bottom', marginBottom: '10vh' }}>
                  <BirthdayCake 
                    onCandleBlown={blowRandomWord}
                    onAllCandlesBlown={handleAllCandlesBlown} 
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {allCandlesBlown && (
        <div 
          ref={nextSectionRef} 
          className="min-h-screen relative overflow-hidden"

        >
          {/* Text at top left */}
          <div className="absolute top-8 left-8 max-w-6xl">
            <p className="text-7xl text-black font-[family-name:var(--font-covered-by-your-grace)] leading-tight inline">
              HAVE AN AMAAAAAZINNGGG BIRTHDAYYYY AND AN AMAZING DAYYYYYYYY I LOVE YOU SO MUCHHHHH MWAAAHHH{' '}
              <img 
                src="/backgrounds/hearts.png" 
                alt="Hearts" 
                className="inline-block w-48 h-48 object-contain align-middle"
              />
            </p>
          </div>
          
          {/* Image at bottom right with pass-through blend mode */}
          <div className="absolute bottom-0 right-0 w-2/3 h-2/3">
            <img 
              src="/backgrounds/us.png" 
              alt="Us" 
              className="w-full h-full object-contain object-bottom-right"
              style={{ 
                filter: 'sepia(5.3)'
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
