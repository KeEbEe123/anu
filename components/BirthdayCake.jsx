'use client';

import { useEffect, useRef, useState } from 'react';

export default function BirthdayCake({ onCandleBlown, onAllCandlesBlown }) {
  const cakeRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const blowIntervalRef = useRef(null);

  // Initialize 20 candles in a nice arrangement
  const [candles, setCandles] = useState(() => {
    const initialCandles = [];
    const positions = [
      { left: 50, top: 5 }, { left: 80, top: 0 }, { left: 110, top: 5 }, { left: 140, top: 0 }, { left: 170, top: 5 },
      { left: 200, top: 0 }, { left: 40, top: 35 }, { left: 70, top: 30 }, { left: 100, top: 35 }, { left: 130, top: 30 },
      { left: 160, top: 35 }, { left: 190, top: 30 }, { left: 220, top: 35 }, { left: 60, top: 65 }, { left: 90, top: 60 },
      { left: 120, top: 65 }, { left: 150, top: 60 }, { left: 180, top: 65 }, { left: 210, top: 60 }, { left: 125, top: 90 }
    ];
    
    positions.forEach((pos, index) => {
      initialCandles.push({ id: index, left: pos.left, top: pos.top, isOut: false });
    });
    
    return initialCandles;
  });

  useEffect(() => {
    // Initialize microphone
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
          analyserRef.current = audioContextRef.current.createAnalyser();
          microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
          microphoneRef.current.connect(analyserRef.current);
          analyserRef.current.fftSize = 256;

          // Start checking for blowing
          blowIntervalRef.current = setInterval(blowOutCandles, 200);
        })
        .catch((err) => {
          console.log('Unable to access microphone: ' + err);
        });
    } else {
      console.log('getUserMedia not supported on your browser!');
    }

    return () => {
      if (blowIntervalRef.current) {
        clearInterval(blowIntervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const isBlowing = () => {
    if (!analyserRef.current) return false;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;
    return average > 80; // Increased threshold from 40 to 80
  };

  const blowOutCandles = () => {
    if (isBlowing()) {
      setCandles(prev => {
        let candleBlownThisTime = false;
        const newCandles = prev.map(candle => {
          if (!candle.isOut && Math.random() > 0.5) {
            candleBlownThisTime = true;
            return { ...candle, isOut: true };
          }
          return candle;
        });
        
        // Call onCandleBlown if a candle was blown out
        if (candleBlownThisTime) {
          onCandleBlown?.();
        }
        
        // Check if all candles are blown out
        if (newCandles.every(c => c.isOut)) {
          setTimeout(() => {
            onAllCandlesBlown?.();
          }, 1000);
        }
        
        return newCandles;
      });
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .birthday-cake-container {
          position: relative;
          width: fit-content;
          margin: 0 auto;
        }

        .cake {
          position: relative;
          width: 250px;
          height: 200px;
          cursor: pointer;
        }
        .plate {
          width: 270px;
          height: 110px;
          position: absolute;
          bottom: -10px;
          left: -10px;
          background-color: #ccc;
          border-radius: 50%;
          box-shadow: 0 2px 0 #b3b3b3, 0 4px 0 #b3b3b3, 0 5px 40px rgba(0, 0, 0, 0.5);
        }
        .cake > * {
          position: absolute;
        }
        .layer {
          position: absolute;
          display: block;
          width: 250px;
          height: 100px;
          border-radius: 50%;
          background-color: #553c13;
          box-shadow: 0 2px 0px #6a4b18, 0 4px 0px #33240b, 0 6px 0px #32230b,
            0 8px 0px #31230b, 0 10px 0px #30220b, 0 12px 0px #2f220b, 0 14px 0px #2f210a,
            0 16px 0px #2e200a, 0 18px 0px #2d200a, 0 20px 0px #2c1f0a, 0 22px 0px #2b1f0a,
            0 24px 0px #2a1e09, 0 26px 0px #2a1d09, 0 28px 0px #291d09, 0 30px 0px #281c09;
        }
        .layer-top {
          top: 0px;
        }
        .layer-middle {
          top: 33px;
        }
        .layer-bottom {
          top: 66px;
        }
        .icing {
          top: 2px;
          left: 5px;
          background-color: #f0e4d0;
          width: 240px;
          height: 90px;
          border-radius: 50%;
        }
        .icing:before {
          content: '';
          position: absolute;
          top: 4px;
          right: 5px;
          bottom: 6px;
          left: 5px;
          background-color: #f4ebdc;
          box-shadow: 0 0 4px #f6efe3, 0 0 4px #f6efe3, 0 0 4px #f6efe3;
          border-radius: 50%;
          z-index: 1;
        }
        .drip {
          display: block;
          width: 50px;
          height: 60px;
          border-bottom-left-radius: 25px;
          border-bottom-right-radius: 25px;
          background-color: #f0e4d0;
        }
        .drip1 {
          top: 53px;
          left: 5px;
          transform: skewY(15deg);
          height: 48px;
          width: 40px;
        }
        .drip2 {
          top: 69px;
          left: 181px;
          transform: skewY(-15deg);
        }
        .drip3 {
          top: 54px;
          left: 90px;
          width: 80px;
          border-bottom-left-radius: 40px;
          border-bottom-right-radius: 40px;
        }
        .birthday-candle {
          background-color: #7b020b;
          width: 12px;
          height: 35px;
          border-radius: 6px/3px;
          z-index: 100;
          position: absolute;
          pointer-events: none;
        }
        .birthday-candle:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 12px;
          height: 6px;
          border-radius: 50%;
          background-color: #ad030f;
        }
        .birthday-candle.out .birthday-flame {
          display: none;
        }
        .birthday-flame {
          position: absolute;
          background-color: orange;
          width: 10px;
          height: 25px;
          border-radius: 8px 8px 8px 8px/20px 20px 8px 8px;
          top: -34px;
          left: 50%;
          margin-left: -7.5px;
          z-index: 101;
          box-shadow: 0 0 10px rgba(255, 165, 0, 0.5), 0 0 20px rgba(255, 165, 0, 0.5),
            0 0 60px rgba(255, 165, 0, 0.5), 0 0 80px rgba(255, 165, 0, 0.5);
          transform-origin: 50% 90%;
          animation: flicker 1s ease-in-out alternate infinite;
        }
        @keyframes flicker {
          0% {
            transform: skewX(5deg);
            box-shadow: 0 0 10px rgba(255, 165, 0, 0.2), 0 0 20px rgba(255, 165, 0, 0.2),
              0 0 60px rgba(255, 165, 0, 0.2), 0 0 80px rgba(255, 165, 0, 0.2);
          }
          25% {
            transform: skewX(-5deg);
            box-shadow: 0 0 10px rgba(255, 165, 0, 0.5), 0 0 20px rgba(255, 165, 0, 0.5),
              0 0 60px rgba(255, 165, 0, 0.5), 0 0 80px rgba(255, 165, 0, 0.5);
          }
          50% {
            transform: skewX(10deg);
            box-shadow: 0 0 10px rgba(255, 165, 0, 0.3), 0 0 20px rgba(255, 165, 0, 0.3),
              0 0 60px rgba(255, 165, 0, 0.3), 0 0 80px rgba(255, 165, 0, 0.3);
          }
          75% {
            transform: skewX(-10deg);
            box-shadow: 0 0 10px rgba(255, 165, 0, 0.4), 0 0 20px rgba(255, 165, 0, 0.4),
              0 0 60px rgba(255, 165, 0, 0.4), 0 0 80px rgba(255, 165, 0, 0.4);
          }
          100% {
            transform: skewX(5deg);
            box-shadow: 0 0 10px rgba(255, 165, 0, 0.5), 0 0 20px rgba(255, 165, 0, 0.5),
              0 0 60px rgba(255, 165, 0, 0.5), 0 0 80px rgba(255, 165, 0, 0.5);
          }
        }
      `}} />

      <div className="birthday-cake-container">
        <div ref={cakeRef} className="cake">
          <div className="plate"></div>
          <div className="layer layer-bottom"></div>
          <div className="layer layer-middle"></div>
          <div className="layer layer-top"></div>
          <div className="icing"></div>
          <div className="drip drip1"></div>
          <div className="drip drip2"></div>
          <div className="drip drip3"></div>
          
          {candles.map(candle => (
            <div
              key={candle.id}
              className={`birthday-candle ${candle.isOut ? 'out' : ''}`}
              style={{ left: candle.left + 'px', top: candle.top + 'px' }}
            >
              {!candle.isOut && <div className="birthday-flame"></div>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}