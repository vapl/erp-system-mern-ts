import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface SubmitButtonProps {
    name: string,
    value: string,
    disabled?: boolean,
    type: string,
    register: UseFormRegister<any>
    registerOptions?: RegisterOptions,
    error?: FieldError,
    errorSubmit?: boolean,
    errorMessage?: string,
    [x: string]: any,
}

const SubmitButton = ({name, value, disabled = false, registerOptions, type, error, register, errorSubmit, errorMessage, ...props}: SubmitButtonProps) => {


    return (
        <div className="mb-5">
            <div className=" text-center my-3">
                {errorSubmit && <span className={`${errorSubmit ? 'text-red-500 italic' : 'text-green-500 italic'}`}>
                    {errorMessage || error?.message}
                </span>}
            </div>
            <input
                type={type}
                value={value}
                className={'cursor-pointer w-full rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90'}
                {...register(name, registerOptions)}
                {...props}
            />
        </div>
    );
};

export default SubmitButton;