import React, { useState } from 'react';
import SignInLayout from '../../layout/SignInLayout';
import { SubmitHandler, useForm } from 'react-hook-form';
import { signIn } from '../../network/orders_api';
import TextInputField from '../../components/Forms/TextInputField';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';


interface FormData {
  email: string,
  password: string,
  submit: string,
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { handleSubmit, reset, formState: { errors }, setError, register } = useForm<FormData>();
  const [messageColor, setMessageColor] = useState<string>();
  
  const onSubmit: SubmitHandler<FormData> = async (formData) => { 
    try {
      
      if (!formData.email || !formData.password) {
        return;
      };

      const user = await signIn(formData);

      if (!user) {
        // Pārbauda vai atbilde ir veiksmīga, ja nē tad met kļūdu
        reset({
          email: '',
          password: '',
        });
        setMessageColor('red');
        setError('submit', {
          type: 'manual',
          message: 'Notika kļūda'
        });
        return;
      };

      navigate('/');
      document.cookie = `userId=${user._id}; max-age=${60*60}; path=/`

    } catch (error) {
      setMessageColor('red');
      setError('submit', {
        type: 'manual',
        message: 'e-pasts vai parole ir nepareizi'
      });

      console.error('Error accured', error)
      const timeoutId = setTimeout(() => {
        setMessageColor('green');
        reset({
          email: '',
          password: '',
        });
      }, 3000); // Pēc 3 sekundēm uzraksts pazudīs
      return () => clearTimeout(timeoutId);
    }
  };


  return (
    <SignInLayout>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center justify-center">
          <div className="w-full border-stroke xl:w-1/2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Ielogoties
              </h2>

              <form onSubmit={handleSubmit(onSubmit)}>
                <TextInputField 
                  name='email'
                  label='E-pasts'
                  type='email'
                  placeholder='Ievadiet savu e-pastu'
                  register={register}
                  registerOptions={{ required: 'E-pasts ir obligāts' }}
                  error={errors.email}
                  svg={<EnvelopeIcon />}
                />
                <TextInputField 
                    name='password'
                    label='Parole'
                    type='password'
                    placeholder='Ievadiet paroli'
                    register={register}
                    registerOptions={{ required: 'Parole ir obligāta'}}
                    error={errors.password}
                    svg={<LockClosedIcon />}
                  />

                <div className="mb-5">
                {errors.submit &&
                  <div className='flex items-center justify-center mt-6 mb-6 bold'>
                     <span className={`text-${messageColor}-500 italic centered`}>{errors.submit.message}</span>
                  </div>
                }
                  <input
                    {...register('submit')}
                    type="submit"
                    value="Ielogoties"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </SignInLayout>
  );
};

export default SignIn;
