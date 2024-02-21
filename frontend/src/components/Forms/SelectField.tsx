import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface SelectFieldProps {
    name: string,
    placeholder?: string,
    label: string,
    options: {
        id: number,
        value: string,
        name: string,
    }[],
    error?: FieldError,
    register: UseFormRegister<any>,
    registerOptions: RegisterOptions,
    [x: string]: any,
}

const SelecField = ({name, label, register, placeholder, registerOptions, error, options, ...props}: SelectFieldProps) => {
    return (
        <div className="mb-6">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
                {label}
            </label>
            <div className="relative">
                <select
                    {...register(name, registerOptions)}
                    {...props}
                    className={`w-full rounded-lg border ${error ? 'border-red-500 dark:border-red-500' : 'border-stroke dark:border-form-strokedark'} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:text-white dark:focus:border-primary`}
                >
                    <option value=''>{placeholder || 'Izvēlieties...'}</option>
                    {options.map(option => (
                        <option key={option.id} value={option.value}>
                            {option.name}
                        </option>
                    ))}
                    
                </select>
                {error && 
                    <span className='text-red-500 italic'>
                        {error?.message}
                    </span>}
            </div>
        </div>
    );
};

export default SelecField;
