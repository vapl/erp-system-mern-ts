import { useForm } from 'react-hook-form';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { User } from '../../models/user';
import { SignUpCredentials } from '../../network/orders_api';
import * as OrderApi from '../../network/orders_api';
import { BriefcaseIcon, EnvelopeIcon, LockClosedIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/solid';
import TextInputField from '../../components/Forms/TextInputField';
import SubmitButton from '../../components/Forms/SubmitButton';
import SelectField from '../../components/Forms/SelectField';
import { TEAlert } from 'tw-elements-react';
import { useState } from 'react';
import PageTitle from '../../components/PageTitle';

interface SignUpProps {
  onSignUpSuccessfull: (user: User) => void,
}

const userRoleOptionsArray = [
  {id: 1, value: 'superadmin', name: 'Galvenais administrators'},
  {id: 2, value: 'admin', name: 'Administrators'},
  {id: 3, value: 'user', name: 'Lietotājs'},
];

const SignUp = ({ onSignUpSuccessfull }: SignUpProps) => {
  const { watch, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpCredentials>();
  const [open, setOpen] = useState<boolean>(false);

  const password = watch('password');

  {/*Funkcija Regex parolei - 6+ burti, 1 lielais burts, 1 cipars, 1 simbols */}
  const passwordRegex = (value: string, message: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/;
    const isValidPassword = passwordRegex.test(value);
    return !isValidPassword ? message : true;
  }


  {/*Funkcija kas pārbauda vai ievadītais e-pasts jau eksistē, 
  ja eksistē, parāda kļūdas paziņojumu*/}
  const getEmailList = async (value: string, message: string) => {
    const users: User[] = await OrderApi.getUsersEmail();
    const emails = users.map(user => user.email);
    const emailExists = emails.some(email => email === value)
    return emailExists ? message : true;
  }
  
  const onSubmit = async (credentials: SignUpCredentials) => {    
    try {

      const { confirmPassword, ...dataToSend } = credentials;
      const newUser = await OrderApi.signUp(dataToSend);
      onSignUpSuccessfull(newUser);
      setOpen(true);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Reģistrācija" />
      <PageTitle title="Reģistrācija" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center justify-center">         

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">              
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Reģistrēt lietotāju
              </h2>

              <form onSubmit={handleSubmit(onSubmit)}>
              <TextInputField 
                  name='name'
                  label='Vārds'
                  type='text'
                  placeholder='Lietotāja vārds'
                  register={register}
                  registerOptions={{ required: 'Vārds ir obligāts' }}
                  error={errors.name}
                  svg={<UserIcon />}
                />
              <TextInputField 
                  name='surname'
                  label='Uzvārds'
                  type='text'
                  placeholder='Lietotāja uzvārds'
                  register={register}
                  error={errors.surname}
                  svg={<UserIcon />}
                />
              <TextInputField 
                  name='email'
                  label='E-pasts'
                  type='email'
                  placeholder='Lietotāja e-pasts'
                  register={register}
                  registerOptions={{ 
                    required: 'E-pasts ir obligāts', 
                    validate: value => getEmailList(value, 'E-pasts jau ir reģistrēts')
                  }}
                  error={errors.email}
                  svg={<EnvelopeIcon />}
                />
              <TextInputField 
                  name='phone_number'
                  label='Tālruņa numurs'
                  type='text'
                  placeholder='Lietotāja tālruņa numurs'
                  register={register}
                  error={errors.phone_number}
                  svg={<PhoneIcon />}
                />
              <TextInputField 
                  name='occupation'
                  label='Amats'
                  type='text'
                  placeholder='Lietotāja amats'
                  register={register}
                  error={errors.occupation}
                  svg={<BriefcaseIcon />}
                />
              <TextInputField 
                  name='password'
                  label='Parole'
                  type='password'
                  placeholder='6+ Burti - vismaz 1 Lielais burts, 1 Cipars, 1 Simbols'
                  register={register}
                  registerOptions={{ 
                    required: 'Parole ir obligāta', 
                    validate: value => passwordRegex(value, 'Parolei jābūt vismaz 6 burtiem, 1 Lielajam burtam, 1 ciparam, 1 simbolam')
                  }}
                  error={errors.password}
                  svg={<LockClosedIcon />}
                />
              <TextInputField 
                  name='confirmPassword'
                  label='Parole atkārtoti'
                  type='password'
                  placeholder='Ievadiet paroli atkārtoti'
                  register={register}
                  registerOptions={{
                    validate: value => value === password || 'Paroles nesakrīt'
                  }}
                  error={errors.confirmPassword}
                  svg={<LockClosedIcon />}
                />
                <SelectField
                  name='role'
                  label='Lietotāja loma'
                  placeholder='Izvēlieties lietotāja lomu...'
                  options={userRoleOptionsArray}
                  register={register}
                  registerOptions={{ 
                    required: 'Lietoāja loma ir obligāta',
                  }}
                  error={errors.role}
                />                
                <SubmitButton
                  name='submit'
                  type='submit'
                  value='Reģistrēt lietotāju'
                  disabled={isSubmitting}
                  register={register}
                  registerOptions={{required: 'Reģistrācija neizdevās, mēģieniet vēlreiz'}}
                  error={errors.submit}
                />

                <TEAlert dismiss autohide delay={5000} open={open} setOpen={setOpen} color="bg-green-300 text-green-950 z-999">
                  <span className="mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  Reģistrācija veiksmīga!
                </TEAlert>

              </form>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SignUp;
