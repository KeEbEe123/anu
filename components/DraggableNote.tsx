'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import Image from 'next/image';

interface DraggableNoteProps {
  onOpen?: () => void;
}

export default function DraggableNote({ onOpen }: DraggableNoteProps) {
  const noteRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(Draggable);

    if (noteRef.current) {
      const note = noteRef.current;
      const threshold = 300; // 200px drag threshold

      // Set initial position immediately (completely hidden below screen)
      gsap.set(note, {
        bottom: '-120%',
        rotation: -80,
      });

      // Slide in from bottom after 3s
      gsap.to(note, {
        bottom: '-75%',
        duration: 0.8,
        delay: 7,
        ease: 'power2.out',
      });

      // Make it draggable
      Draggable.create(note, {
        type: 'y',
        bounds: { minY: -500, maxY: 0 },
        onDrag: function () {
          // Calculate rotation based on drag position
          const dragDistance = Math.abs(this.y);
          const dragProgress = Math.min(dragDistance / 500, 1);
          const rotation = -80 + dragProgress * 75; // From -80 to -15 degrees
          gsap.set(note, { rotation: rotation });
        },
        onDragEnd: function () {
          if (isOpen) return; // Don't allow closing once opened
          
          const dragDistance = Math.abs(this.y);
          
          // If dragged beyond threshold, snap to open position
          if (dragDistance > threshold) {
            setIsOpen(true);
            onOpen?.();
            gsap.to(note, {
              bottom: '-55%',
              rotation: -5,
              duration: 0.5,
              ease: 'power2.out',
            });
            // Disable dragging after opening
            this.disable();
          } else {
            // Snap back to peeking position
            gsap.to(note, {
              y: 0,
              rotation: -80,
              duration: 0.5,
              ease: 'power2.out',
            });
          }
        },
      });
    }
  }, []);

  return (
    <div
      ref={noteRef}
      className={`absolute left-1/2 -translate-x-1/2 w-[1200px] z-50 ${
        isOpen ? 'overflow-y-auto h-screen' : ''
      }`}
      style={{ 
        touchAction: isOpen ? 'auto' : 'none',
        bottom: '-100%',
        cursor: isOpen ? 'url(/normal.png), auto' : 'url(/grab.png), grab'
      }}
    >
      <Image
        src="/backgrounds/note1.png"
        alt="Draggable note"
        width={2200}
        height={2600}
        className="w-full h-auto pointer-events-none select-none"
        draggable={false}
        style={{filter: 'sepia(5.3)'}}
      />
    </div>
  );
}
