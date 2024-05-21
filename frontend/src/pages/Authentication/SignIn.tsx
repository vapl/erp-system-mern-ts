import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import SubmitButton from '../../components/Forms/SubmitButton';
import TextInputField from '../../components/Forms/TextInputField';
import PageTitle from '../../components/PageTitle';
import AuthContext from '../../components/Routes/AuthContext';
import SignInLayout from '../../layout/SignInLayout';
import { LoginCredentials, signIn } from '../../network/users_api';

const SignIn = () => {
  const { login } = useContext(AuthContext);
  const { handleSubmit, formState: { errors, isSubmitting }, register } = useForm<LoginCredentials>();
  const [isError, setIsError] = useState<boolean>(false);
  const navigate = useNavigate();

  register('password', {
    onChange: () => setIsError(false)
  });

  register('email', {
    onChange: () => setIsError(false)
  });

  async function onSubmit(credentials: LoginCredentials) { 
    try {
      await signIn(credentials);
      login();      
      navigate('/');
    } catch (error) {
      console.error('Error accured', error)
      setIsError(true);
    }
  };


  return (
    <SignInLayout>
      <PageTitle title="Signin" />
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
                  registerOptions={{ required: 'Parole ir obligāta' }}
                  error={errors.password}
                  svg={<LockClosedIcon />}
                />

                <div className="mb-5">
                  <SubmitButton 
                    name='submit'
                    type='submit'
                    value='Ielogoties'
                    disabled={isSubmitting}
                    register={register}
                    registerOptions={{required: 'E-pasts vai parole ir nepareizi'}}
                    error={errors.submit}
                    errorSubmit={isError}
                    errorMessage='Parole vai e-pasts nav pareizi'
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

