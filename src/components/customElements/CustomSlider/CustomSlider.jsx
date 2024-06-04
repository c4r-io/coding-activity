"use client"
import React, { useState, useRef, useEffect } from 'react';
import styles from './CustomSlider.module.css';

const CustomSlider = ({ min, max, step, value, onChange }) => {
  const [sliderValue, setSliderValue] = useState(value);
  const sliderRef = useRef(null);
  const thumbRef = useRef(null);
  const trackRef = useRef(null);

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

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "140px",
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
      <div
        ref={thumbRef}
        style={{ left: `${thumbPosition}%`,
        position: "absolute",
        top: "50%",
        width: "140px",
        height: "140px",
        backgroundColor: "#007bff",
        borderRadius: "1%",
        transform: "translate(-50%, -50%)",
        cursor: "pointer",
       }}
        onMouseDown={handleMouseDown}
      >
        <div>{sliderValue}</div>
      </div>
    </div >
  );
};

export default CustomSlider;
