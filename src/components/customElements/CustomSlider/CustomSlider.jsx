"use client"
import React, { useState, useRef, useEffect } from 'react';

const CustomSlider = ({ min=0, max=10, step=1, value=0, onChange, children }) => {
  const [sliderValue, setSliderValue] = useState(value);
  const sliderRef = useRef(null);
  const thumbRef = useRef(null);
  const trackRef = useRef(null);
  const blockSize = 120;

  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  const calculateValue = (clientX) => {
    const { left, width } = trackRef.current.getBoundingClientRect();
    const relativeX = clientX - left;
    const percent = Math.min(Math.max(relativeX / width, 0), 1);
    const newValue = Math.round((min + percent * (max - min)) / step) * step;
    return newValue;
  };

  const handleMouseMove = (e) => {
    const newValue = calculateValue(e.clientX);
    setSliderValue(newValue);
    onChange(newValue);
  };

  const handleMouseDown = (e) => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleClick = (e) => {
    const newValue = calculateValue(e.clientX);
    setSliderValue(newValue);
    onChange(newValue);
  };

  const thumbPosition = ((sliderValue - min) / (max - min)) * 100;
  const calculateThumbPosition = () => {
    const thumbPosition = ((sliderValue - min) / (max - min)) * 100;
    const newPo = 100-8;
    const dif = 8;
    const newLeft = ((thumbPosition - dif) / (newPo - dif)) * 100
    return newLeft
  }
  return (
    <div style={{
      padding: "0px 60px",
      position: "relative",
    }}>
      <div style={{
        position: "absolute",
        top: "50%",
        left: "2px",
        right: "0",
        height: "4px",
        width: "calc(100% - 4px)",
        backgroundColor: "#ddd",
        transform: "translateY(-50%)",
      }}>
        <div style={{
          position: "absolute",
          bottom: "-3px",
          left: "-10px",
          top: "-6px",
          width: "0",
          height: "0",
          borderLeft: "16px solid transparent",
          borderRight: "16px solid transparent",
          borderTop: "16px solid #ddd",
          transform: "rotate(90deg)",
        }}>
        </div>
        <div style={{
          position: "absolute",
          bottom: "-3px",
          right: "-10px",
          top: "-6px",
          width: "0",
          height: "0",
          borderLeft: "16px solid transparent",
          borderRight: "16px solid transparent",
          borderTop: "16px solid #ddd",
          transform: "rotate(-90deg)",
        }}>
        </div>
      </div>
    <div style={{
      position: "relative",
      width: "100%",
      height: "120px",
    }} ref={sliderRef} onClick={handleClick}>
      <div style={{
        position: "absolute",
        top: "50%",
        left: "0",
        right: "0",
        height: "4px",
        backgroundColor: "#ddd",
        transform: "translateY(-50%)",
      }} ref={trackRef}>
      </div>
      <div
        ref={thumbRef}
        style={{ left: `${thumbPosition}%`,
        position: "absolute",
        top: "50%",
        width: "120px",
        height: "120px",
        backgroundColor: "#DD8B3C",
        borderRadius: "3%",
        transform: "translate(-50%, -50%)",
        cursor: "pointer",
        padding: "4px",
       }}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            color: "#6E2E14",
            whiteSpace: "pre",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "calc(100% - 2px)",
            height: "calc(100% - 2px)",
            webKitUserSelect: "none", 
            msUserSelect: "none",
            userSelect: "none", 
          }}
        >{children}
        </div>
      </div>
    </div >
    </div>
  );
};

export default CustomSlider;
