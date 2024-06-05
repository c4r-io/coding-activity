"use client"
import React, { useState, useRef, useEffect, Fragment } from 'react';
import CustomSlider from './CustomSlider';

const CustomListSlider = ({ value = "test", options = ["test"], onChange, children }) => {
  const [max, setMax] = useState(5);
  const [defaultValue, setDefaultValue] = useState(0);
  const handleSliderChange = (newValue) => {
    if (onChange) {
      onChange(options[newValue])
    }
  }
  useEffect(() => {
    if (Array.isArray(options) && options.length >= 0) {
      if (options.indexOf(value) !== -1) {
        setDefaultValue(options.indexOf(value));
      }
      setMax(options.length - 1);
    }
  }, [options, value])
  return (
    <Fragment>
      <CustomSlider min={0} max={max} step={1} value={defaultValue} onChange={handleSliderChange} >
        {children}
      </CustomSlider>
    </Fragment>
  );
};

export default CustomListSlider;
