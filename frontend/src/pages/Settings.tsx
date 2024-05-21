import { BriefcaseIcon, EnvelopeIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/solid';
import isEqual from 'lodash/isEqual';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TEAlert } from 'tw-elements-react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import FileInputField from '../components/Forms/FileInputField';
import SubmitButton from '../components/Forms/SubmitButton';
import TextInputField from '../components/Forms/TextInputField';
import PageTitle from '../components/PageTitle';
import AuthContext from '../components/Routes/AuthContext';
import { User } from '../models/user';
import * as UsersApi from '../network/users_api';
import ConfirmationDialog from './UiElements/ConfirmationDialog';
import UserProfileImage from './UiElements/UserProfileImage';

const Settings = () => {
  const { user, updateUser } = useContext(AuthContext);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UsersApi.updateUserDataCredentials>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

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
  
  const onSubmit = async (formData: UsersApi.updateUserDataCredentials) => {    
    try {
        const userFormData = new FormData();
        
        // Append other form data fields to FormData object
        
        Object.keys(formData).forEach(key => {
            const typedKey = key as keyof UsersApi.updateUserDataCredentials; // Type assertion
            if (typedKey !== 'profile_image' && typedKey !== 'submit') {
                userFormData.append(typedKey, formData[typedKey]);
            }
        });
          
        // Make a PUT request to update user data
        await UsersApi.updateUserData(userFormData);
        const updatedUserCredentials = await UsersApi.getLoggedInUser();

        const userValues = {
          name: user?.name,
          surname: user?.surname,
          email: user?.email,
          phone_number: user?.phone_number,
          occupation: user?.occupation,
        }

        const { profile_image, submit, ...newForm } = formData;

        const changesMade = !isEqual(userValues, newForm);

        if (!changesMade) {
          setOpen(false);
          return;
        } else {
          updateUser(updatedUserCredentials);
          setOpen(true);
        }

    } catch (error) {
        console.error(error);
    }
  };
  
  const onSubmitImage = async (formData: UsersApi.updateUserDataCredentials) => {    
    try {
        const imageFormData = new FormData();

        // Append file
        const file = formData.profile_image[0];
        imageFormData.append('profile_image', file);
        
        // Make a PUT request to update user data
        await UsersApi.updateUserData(imageFormData);
        const updatedUserCredentials = await UsersApi.getLoggedInUser();
        const changesMade = !isEqual(user?.profile_image, updatedUserCredentials.profile_image);
        if (changesMade) {
          updateUser(updatedUserCredentials);
          setOpen(true);
        }
    } catch (error) {
        console.error(error);
    }
  };
  const deleteProfileImage = async () => {
    if (!user?.profile_image) {
      console.error('User image is undefinend');
      setOpen(false)
      return;
    }
    try {
      await UsersApi.deleteFile(user.profile_image);
      const apiUserData = await UsersApi.getLoggedInUser();
      const changesMade = !isEqual(user.profile_image, apiUserData.profile_image);
      setDialogOpen(false);
      if (changesMade) {
        updateUser({ ...user, profile_image: 'profile_img_placeholder.jpeg' });
        setOpen(true);
      }
    } catch (error) {
      console.error('Error deleting file', error);
    }      
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Iestatījumi" />
      <PageTitle title='Iestatījumi' /> 

      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Personīgā informācija
              </h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-5.5 grid grid-cols-1 gap-5.5 sm:grid-cols-2">
                  <TextInputField
                    name='name'
                    label='Vārds'
                    type='text'
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
                    register={register}
                    error={errors.surname}
                    svg={<UserIcon />}
                  />
                </div>

                <div className="mb-5.5">
                  <TextInputField 
                    name='email'
                    label='E-pasts'
                    type='email'
                    defaultValue={user?.email}
                    register={register}
                    registerOptions={{
                      required: 'E-pasts ir obligāts',
                      validate: value => getEmailList(value, 'E-pasts jau ir reģistrēts')
                    }}
                    error={errors.email}
                    svg={<EnvelopeIcon />}
                  />
                </div>
                
                <div className="mb-5.5">
                  <TextInputField 
                    name='phone_number'
                    label='Tālruņa numurs'
                    type='text'
                    defaultValue={user?.phone_number}
                    register={register}
                    error={errors.phone_number}
                    svg={<PhoneIcon />}
                  />
                </div>
                <div className="mb-5.5">
                  <TextInputField 
                    name='occupation'
                    label='Amats'
                    type='text'
                    defaultValue={user?.occupation}
                    register={register}
                    error={errors.occupation}
                    svg={<BriefcaseIcon />}
                  />
                </div>
                <div className="mb-5.5">
                  <TextInputField 
                    name='role'
                    label='Lietotāja statuss'
                    type='text'
                    defaultValue={user?.role}
                    register={register}
                    disabled={true}
                    className='text-slate-300'
                    // svg={<BriefcaseIcon />}
                  />
                </div>

                <div className="flex justify-end gap-4.5">
                  <SubmitButton
                    name='submit'
                    type='submit'
                    value='Saglabāt'
                    disabled={isSubmitting}
                    register={register}
                    registerOptions={{required: 'Dati netika atjaunoti, mēģieniet vēlreiz'}}
                    error={errors.submit}
                  />
                </div>
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
                  Lietotāja dati tika atjaunoti!
                </TEAlert>
              </form>
            </div>
          </div>
        </div>
        <div className="col-span-5 xl:col-span-2">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Profila bilde
              </h3>
            </div>
            <div className="p-7">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-14 w-14 rounded-full overflow-hidden">
                  <UserProfileImage imageName={user?.profile_image}/>
                </div>
                <div>
                  <span className="mb-1.5 text-black dark:text-white">
                    Labot profila bildi
                  </span>
                  <span className="flex gap-2.5">
                    <button onClick={() => setDialogOpen(true)} className="text-sm hover:text-danger">
                      Izdzēst
                    </button>
                  </span>
                  {dialogOpen &&
                  <ConfirmationDialog 
                      isOpen={dialogOpen}
                      title='Vai tiešām dzēst bildi?'
                      actionButtonCancel='Atcelt'
                      actionButtonConsent='Dzēst'
                      consentFunction={deleteProfileImage}
                    />
                  }
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmitImage)}>
                <div
                  id="FileUpload"
                  className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                >
                  <FileInputField
                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    accept="image/*"
                    name='profile_image'
                    label=''
                    type='file'
                    register={register}
                    error={errors.profile_image}
                  />
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                          fill="#3C50E0"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                          fill="#3C50E0"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                          fill="#3C50E0"
                        />
                      </svg>
                    </span>
                    <p>
                      <span className="text-primary">Lejupielādēt </span>
                      vai ievilkt failu
                    </p>
                    <p className="mt-1.5">PNG vai JPG</p>
                    <p>(max, 800 X 800px)</p>
                  </div>
                </div>

                <div className="flex justify-end gap-4.5">
                  <SubmitButton
                    name='submit'
                    type='submit'
                    value='Saglabāt'
                    disabled={isSubmitting}
                    register={register}
                    registerOptions={{required: 'Dati netika atjaunoti, mēģieniet vēlreiz'}}
                    error={errors.submit}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
