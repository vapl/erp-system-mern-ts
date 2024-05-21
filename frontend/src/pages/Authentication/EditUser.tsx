import { BriefcaseIcon, EnvelopeIcon, LockClosedIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Alert from '../../components/Alerts/Alert';
import SelectField from '../../components/Forms/SelectField';
import SubmitButton from '../../components/Forms/SubmitButton';
import TextInputField from '../../components/Forms/TextInputField';
import { User } from '../../models/user';
import * as UsersApi from '../../network/users_api';
import { SignUpCredentials } from '../../network/users_api';

const userRoleOptionsArray = [
  {id: 1, value: 'superadmin', name: 'Galvenais administrators'},
  {id: 2, value: 'admin', name: 'Administrators'},
  {id: 3, value: 'user', name: 'Lietotājs'},
];

interface Props {
  userId: string,
  open: boolean,
}

const EditUser: React.FC<Props> = ({userId, open}) => {
  // const { user } = useContext(AuthContext);
  const { watch, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpCredentials>();
  const [user, setUser] = useState<User | null>(null);
  const [openAlert, setOpenAlert] = useState<boolean>(false);

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
    const loggedInUser = await UsersApi.getLoggedInUser();
    const users: User[] = await UsersApi.getAllUsersData();
    const emails = users.map(user => user.email);
    const emailExists = emails.some(email => email === value);
    if (loggedInUser.email === value) return;
    return emailExists ? message : true;
  }

  useEffect (() => {
    const getUserById = async () => {
      try {
        const users: User[] = await UsersApi.getAllUsersData();
        const foundUser = users.find(user => user._id === userId);
        if (foundUser) setUser(foundUser);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      }      
    };
    getUserById();
  }, [open]);
  
  const onSubmit = async (formData: SignUpCredentials) => {    
    try {
      // Make a PUT request to update user data
      await UsersApi.updateUserDataByAdmin(userId, formData);
      setOpenAlert(true);
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-center">

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">              
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Rediģēt lietotāju
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
            <TextInputField 
                name='name'
                label='Vārds'
                type='text'
                placeholder='Lietotāja vārds'
                defaultValue={user?.name}
                register={register}
                registerOptions={{ required: 'Vārds ir obligāts' }}
                error={errors.name}
                svg={<UserIcon />}
              />
            <TextInputField 
                name='surname'
                label='Uzvārds'
                type='text'
                defaultValue={user?.surname}
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
                defaultValue={user?.email}
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
                defaultValue={user?.phone_number}
                register={register}
                error={errors.phone_number}
                svg={<PhoneIcon />}
              />
            <TextInputField 
                name='occupation'
                label='Amats'
                type='text'
                placeholder='Lietotāja amats'
                defaultValue={user?.occupation}
                register={register}
                error={errors.occupation}
                svg={<BriefcaseIcon />}
              />
            <TextInputField 
                name='password'
                label='Parole'
                type='password'
                placeholder='6+ Burti - vismaz 1 Lielais burts, 1 Cipars, 1 Simbols'
                defaultValue={user?.password}
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
                defaultValue={user?.password}
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
                defaultValue={user?.role}
                options={userRoleOptionsArray}
                register={register}
                registerOptions={{ 
                  required: 'Lietoāja loma ir obligāta',
                }}
                error={errors.role}
              />
              <Alert 
                successText='Reģistrācija veiksmīga'
                errorText='Reģistrācija neizdevās'
                success={openAlert}
                error={errors.submit}
              />
              <div className='flex gap-4 justify-between'>
                {/* <input 
                  className='cursor-pointer w-full rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 w-100 bg-neutral-400 border-neutral-400 h-15'
                  type='button'
                  value='Atcelt'
                  onClick={() => open(false)}
                /> */}
                <SubmitButton
                  className='w-100 h-15'
                  name='submit'
                  type='submit'
                  value='Apstiprināt'
                  disabled={isSubmitting}
                  register={register}
                  registerOptions={{required: 'Reģistrācija neizdevās, mēģieniet vēlreiz'}}
                  error={errors.submit}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUser;
