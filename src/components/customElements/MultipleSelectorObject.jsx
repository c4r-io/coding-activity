"use client"
import React, { createRef, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const MultipleSelectorObject = ({ children, fields,labelKey, handleSelected }) => {
  const selectorBtnEl = useRef(null);
  const inputElement = useRef(null);
  const [isOnList, setIsOnList] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  // Create a 2D array of refs
  const divRefs = useRef(
    Array.from({ length: fields.length }, () => createRef())
  );

  // Create a 2D array of state to track click status
  const [scheduleClicked, setScheduleClicked] = useState(
    Array.from({ length: fields.length }, () => false)
  );

  // Function to handle the click event on a div
  const handleClick = (rowIndex) => {
    // Toggle the click status
    const updatedClicked = [...scheduleClicked];
    updatedClicked[rowIndex] = !updatedClicked[rowIndex];
    setScheduleClicked(updatedClicked);
    setFieldSelected(updatedClicked);
  };
  const setFieldSelected = (e) => {
    setSelected(e);
    const selectedValues = [];
    if (handleSelected) {
      selectedValues.length = 0;
      for (let i in fields) {
        if (e[i]) {
          selectedValues.push(fields[i]);
        }
      }
      handleSelected(selectedValues);
    }
  };
  const btnblur=()=>{
    setIsOpen(false);
  }
  return (
    <div tabIndex={-1} ref={selectorBtnEl} onBlur={btnblur} className="relative w-full">
      <div
        className={`${
          isOpen ? "rounded-b-none" : ""
        } bg-transparent text-white relative rounded-md border border-gray-600`}
      >
        <div
          ref={inputElement}
          className={`${
            isOpen ? "z-0" : "z-50"
          } h-[40px] px-2 cursor-pointer w-full absolute top-0 left-0 opacity-0`}
          type="text"
          onFocus={() => {
            setIsOpen(true);
          }}
        ></div>
        <div
          className="bg-transparent w-[40px] h-[40px] flex items-center justify-center absolute right-0 top-0 cursor-pointer pointer-events-none rounded-tl-xl  rounded-bl-xl"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          >
          <MdKeyboardArrowDown />
        </div>
        <div className="text-white text-sm width-full flex justify-start items-center relative z-50">
          <div
            className="h-[40px] flex items-center px-2 pl-[10px] cursor-pointer w-full"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <p>{children}</p>
          </div>
        </div>
      </div>

      <div
        onMouseOver={() => setIsOnList(false)}
        onMouseLeave={() => setIsOnList(true)}
        className={`${
          isOpen ? "max-h-[300px] overflow-auto" : "h-0 overflow-hidden"
        } absolute text-white top-[100%] w-full bg-gray-800 rounded-bl-xl rounded-br-xl z-[1000]`}
      >
        {fields &&
          divRefs.current.map((ref, index) => (
            <div
              className={`${
                scheduleClicked[index] ? "bg-gray-600" : ""
              } min-h-[40px] flex items-center px-2 cursor-pointer relative border-b border-gray-700`}
              key={index}
              ref={ref}
              onClick={() => handleClick(index)}
            >
              <div className="absolute left-0 top-0 w-[40px] h-[40px] flex items-center justify-center">
                {scheduleClicked[index] && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={10}
                    viewBox="0 0 20 15"
                    fill="none"
                  >
                    <path
                      d="M0.0227051 7.81251L1.53407 6.26138L6.78407 11.4318L17.642 0.613647L19.1932 2.16478L6.78407 14.5341L0.0227051 7.81251Z"
                      fill="#A5A5A5"
                    />
                  </svg>
                )}
              </div>
              <p className="pl-[26px] text-sm text-white">{fields[index][labelKey]}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MultipleSelectorObject;
