import { useState } from "react";
import React from "react";
import ThumpUserHolder from "./thump_user_holder";
import { X } from "lucide-react";

export type selectOption = {
  label: string;
  value: string | number;
  img?: string;
};

export type SingleSelectProps = {
  multiple?: false;
  value?: selectOption;
  onChange: (value: selectOption | undefined) => void;
};
export type MultiSelectProps = {
  multiple: true;
  value: selectOption[];
  onChange: (value: selectOption[]) => void;
};

type selectProps = {
  option: selectOption[];
  title?: string;
} & (SingleSelectProps | MultiSelectProps);

export  function MultiSelect({ multiple, option, value, onChange , title }: selectProps) {
  const [open, setOpen] = useState(false);

  console.log(value);

  function toggleDropdown() {
     setOpen((prev) => !prev);
   }


  function clearOption() {
     multiple ? onChange([]) : onChange(undefined);
  }
  
  function selectOption(option: selectOption) {
    if (multiple) {
      if(value.includes(option)) {
        onChange(value.filter((val) => val !== option));
      }else{
            onChange([...value, option]);
      }
    } else {
      if(option !== value) {
          onChange(option);
     }
    }
  }

  function isOptionSelected(option: selectOption) {
     return multiple ? value.includes(option) : value === option;
  }

  return (
    <div 
    className="w-full" 
    onClick={toggleDropdown}
    >
      <div className=" flex flex-col justify-between gap-3 border-2 border-white rounded-md p-3 w-full">
        <label htmlFor="">
          { title ? title : multiple ? "Select multiple" : "Select one"}
        </label>
        <div className="flex flex-row justify-between items-center border-[1px] border-BorderColor py-[4px] rounded-md min-h-[50px] w-full">
          <div className="container flex flex-row flex-wrap gap-2 ">
            {multiple ? value.map(v=>(
                <ThumpUserHolder key={v.value} img={v.img} name={v.label} haveClose onClose={
                      ()=>{
                          selectOption(v);
                      }
                }/>
            )) : value && <ThumpUserHolder img={value.img} name={value.label}/>}
          </div>
          <div
              
              onClick={clearOption}
              className="text-white bg-transparent border-l-2 border-BorderColor flex items-center justify-center h-full px-4 cursor-pointer"
            >
              <X/>
          </div>
        </div>
        {open && <div className={"bg-mainColor w-full max-h-[320px] rounded-md p-3 border-2 border-white" } >
          <div 
          className={"flex flex-col gap-3"}
          >
            {option.map((opt, index) => (
              <div
                key={opt.value}
                className=""
                onClick={e => {
                    selectOption(opt);
                }}
              >
                <ThumpUserHolder img={opt.img} name={opt.label}/>
              </div>
            ))}
          </div>
        </div>}
      </div>
    </div>
  );
}
