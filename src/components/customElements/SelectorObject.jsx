import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
const Selector = ({ children, fields, labelKey, handleSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const setFieldSelected = (e) => {
    setSelected(e);
    if (handleSelected) {
      handleSelected(e)
    }
  };
  const btnblur = () => {
    setIsOpen(false);
  }
  return (
    <div tabIndex={-1} onBlur={btnblur} className={`${isOpen ? 'rounded-br-none' : ''} bg-transparent text-white border border-gray-600 relative rounded-md`}
      onClick={() => {
        setIsOpen(!isOpen);
      }}
    >
      <div
        className="bg-transparent w-[40px] h-[40px] flex items-center justify-center absolute right-0 top-0 cursor-pointer"

      >
        <MdKeyboardArrowDown />
      </div>
      <div className="text-white width-full flex justify-start items-center relative ">
        <div className="h-[40px] flex items-center px-2 cursor-pointer text-sm">
          <p>{selected ? selected[labelKey] : children}</p>
        </div>
        <div
          className={`${isOpen ? "max-h-[300px] overflow-auto" : "h-0 overflow-hidden"
            } absolute top-[100%] w-full bg-gray-800 rounded-bl-xl rounded-br-xl z-40`}
        >
          {fields && fields.map((e, index) => (
            <div
              className="min-h-[40px] flex items-center px-2 cursor-pointer text-sm  border-b border-gray-700"
              key={index}
              onClick={() => setFieldSelected(e)}
            >
              <p>{e[labelKey]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Selector;
