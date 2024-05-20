import { useEffect, useState, Fragment, useRef } from "react";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";


function ObjectDropdownWithKey({ onUpdate, optionList, defaultSelected, labelKey }) {
  const [selected, setSelected] = useState("");
  const handleSelected = (value) => {
    onUpdate(value);
    setSelected(value[labelKey]);
  };
  useEffect(() => {
    if (defaultSelected) {
      setSelected(defaultSelected);
    }
  }, [defaultSelected]);
  return (
    <div className="relative ">
      <Listbox value={selected} onChange={handleSelected}>
        <div className="relative mt-1">
          <Listbox.Button className="border border-gray-300/30 relative w-full cursor-default rounded-lg bg-transparent text-black dark:text-ui-white-text py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-gray-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-300 sm:text-sm">
            <span className="block truncate">{selected}</span>
            <span className="pointer-competitions-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-black text-ui-white-text py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm border border-gray-300/30 ">
              {optionList &&
                optionList?.map((itemData, itemDataIdx) => (
                  <Listbox.Option
                    key={itemDataIdx}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active
                        ? "bg-gray-100/10 text-ui-white-text"
                        : "text-ui-white-text"
                      }`
                    }
                    value={itemData}
                  >
                    {({ selected }) => (
                      <Fragment>
                        <span
                          className={`block truncate ${selected ? "font-medium" : "font-normal"
                            }`}
                        >
                          {itemData[labelKey]}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ui-white-text">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </Fragment>
                    )}
                  </Listbox.Option>
                ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}


export default ObjectDropdownWithKey;