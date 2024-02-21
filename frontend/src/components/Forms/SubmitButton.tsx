import { FieldError, RegisterOptions } from "react-hook-form";

interface SubmitButtonProps {
    value: string,
    disabled?: boolean,
    registerOptions?: RegisterOptions,
    error?: FieldError,
    [x: string]: any,
}

const SubmitButton = ({value, disabled = false, error, onClick, ...props}: SubmitButtonProps) => {


    return (
        <div className="mb-5">
            {error && <span className={`${error ? 'text-red-500 italic' : 'text-green-500 italic'}`}>
                {error?.message}
            </span>}
            <input
                type="submit"
                value={value}
                className={'w-full rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90'}
                {...props}
            />
        </div>
    );
};

export default SubmitButton;