import React from "react";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface TextInputFieldProps {
    name: string,
    label: string,
    defaultValue?: string,
    className?: string,
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    error?: FieldError,
    svg?: JSX.Element,
    [x: string]: any,
}

const TextInputField = ({name, label, defaultValue, className, register, registerOptions, onChange, error, svg, ...props}: TextInputFieldProps) => {
    return (
        <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
                {label}
            </label>
            <input
                className={`w-full rounded-lg border ${error ? 'border-red-500 dark:border-red-500' : 'border-stroke dark:border-form-strokedark'} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:text-white dark:focus:border-primary ${className}`}
                defaultValue={defaultValue}
                {...props}
                {...register(name, registerOptions)}
            />
            {svg && <span className="absolute right-4 top-4">{React.cloneElement(svg, { className: `fill-current ${svg.props.className}`, width: "22", height: "22", viewBox: "0 0 22 22", fill: "none", xmlns: "http://www.w3.org/2000/svg" })}</span>}
        </div>
   )
};

export default TextInputField