import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';

interface FormData {
  name: string,
  surname: string,
  email: string,
  password: string,
  confirmPassword: string
  phone_number: string,
  occupation: string,
  role: string,
}

interface BorderColor {
  name: string | null,
  email: string | null,
  password: string | null,
  confirmPassword: string | null,
  role: string | null,
}

interface SuccessRegistrationStatus {
  success: boolean,
  successMessage: string,
  errorMessage: string,
}

const SignUp: React.FC = () => {

  const { register, reset, handleSubmit } = useForm<FormData>();

  const [showSuperAdminOption, setShowSuperAdminOption] = useState(true);
  const [passWarning, setPassWarning] = useState<string | null>(null);
  const [submitValidation, setSubmitValidation] = useState<string | null>(null);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const [checkNameField, setCheckNameField] = useState<string | null>(null);
  const [checkEmailField, setCheckEmailField] = useState<string | null>(null);
  const [checkPasswordField, setCheckPasswordField] = useState<string | null>(null);
  const [checkRoleField, setCheckRoleField] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState<SuccessRegistrationStatus | null>(null);
  const [formValues, setFormValues] = useState<FormData>({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    occupation: '',
    role: '',
  });
  const [fieldWarnings, setFieldWarnings] = useState<BorderColor>({
    name:  null,
    email: null,
    password: null,
    confirmPassword: null,
    role: null,
  });



  const fieldWarning = (fieldName:keyof BorderColor, message: string | null) => {
    setFieldWarnings(prevState => ({
      ...prevState,
      [fieldName]: message
    }));
  };

  const submitAllowed = 'cursor-pointer';
  const submitNotAllowed = 'cursor-not-allowed';


  {/* Pārbauda vai paroles sakrīt un vai e-pasts nav reģistrēts */}
  const handleInputChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'name':
        fieldWarning('name', value === '' ? 'border-red-500' : null);
        setCheckNameField(value === '' ? 'Vārds ir obligāts' : null);
        break;
      case 'email':
        fieldWarning('email', value === '' ? 'border-red-500' : null)
        setCheckEmailField(value === '' ? 'E-pasts ir obligāts' : null);
        if (value) {
          checkEmailExistence(value).then(isEmailRegistered => {
            fieldWarning('email', value === '' ? 'border-red-500' : null)
            setEmailWarning(isEmailRegistered ? 'Šāds epasts jau reģistrēts, izvēlieties citu' : '');
          }).catch(error => {
            console.error('Error checking email existence:', error);
          });
        } else {
          setEmailWarning('')
        }
        break;
      case 'password':
        fieldWarning('password', value === '' ? 'border-red-500' : null)
        setCheckPasswordField(value === '' ? 'Parole ir obligāta' : null);
        if (value && formValues.confirmPassword) {
          setPasswordMatch(value === formValues.confirmPassword);
          setSubmitValidation(value === formValues.confirmPassword ? submitAllowed : submitNotAllowed);
          setPassWarning(value === formValues.confirmPassword ? null : 'Paroles nesakrīt');          
        };
        break;
      case 'confirmPassword': 
        if (value && formValues.password) {
          fieldWarning('confirmPassword', value === '' ? 'border-red-500' : null)
          setPasswordMatch(value === formValues.password);
          setSubmitValidation(value === formValues.password ? submitAllowed : submitNotAllowed);
          setPassWarning(value === formValues.password ? null : 'Paroles nesakrīt');          
        };
        break;
      case 'role':
        fieldWarning('role', value === '' ? 'border-red-500' : null);
        setCheckRoleField(value === '' ? 'Lietotāja loma ir obligāta' : null);
        break;
      default:
        break;
    };
    
    // Isetatīt formas vērtības
    setFormValues((prevFormValues) => (
      {
        ...prevFormValues,
        [name]: value,
      }
    ));
  };
  
  const checkEmailExistence = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return data.some((user: { email: string; }) => user.email === email);
    } catch (error) {
      console.error('Error validation check:', error);
      return false;
    }
  };


  {/*/ Pārbauda vai paroles sakrīt un vai e-pasts nav reģistrēts */}

  {/* Pārbauda vai superadministrators jau ir reģistrēts, lai parādītu vai noslēptu lietotāja lomas opciju */}
  useEffect(() => {

    const checkRoleExistence = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        const superAdminExists = data.some((user: { role: string; }) => user.role === 'superadmin');
        setShowSuperAdminOption(superAdminExists);

      } catch (error) {
        console.error('Error validation check:', error);
      }
    };
    checkRoleExistence();
  }, []);
  {/*/ Pārbauda vai superadministrators jau ir reģistrēts, lai parādītu vai noslēptu lietotāja lomas opciju */}

  {/* Aizsūtām datus uz serveri */}
  const onSubmit: SubmitHandler<FormData> = async (formData) => {

    // pārbauda vai ievadītās paroles sakrīt
    if (!passwordMatch) return;
    
    if (!formData.name || !formData.email || !formData.role || !formData.password) {
      fieldWarning('name', formData.name === '' ? 'border-red-500' : null);
      fieldWarning('email', formData.email === '' ? 'border-red-500' : null);
      fieldWarning('password', formData.password === '' ? 'border-red-500' : null);
      fieldWarning('confirmPassword', formData.confirmPassword === '' ? 'border-red-500' : null);
      fieldWarning('role', formData.role === '' ? 'border-red-500' : null);
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(formData.email);
      setCheckEmailField(!isValidEmail ? 'Lūdzu, ievadiet derīgu e-pasta adresi formātā: example@example.com"' : null);
      setCheckEmailField(formData.email === '' ? 'E-pasts ir obligāts' : null);
      setCheckNameField(formData.name === '' ? 'Vārds ir obligāts' : null);
      setCheckPasswordField(formData.password === '' ? 'Parole ir obligāta' : null);

      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/;
      const isValidPassword = passwordRegex.test(formData.password);
      setCheckPasswordField(!isValidPassword ? 'Jābūt 6+ Burtiem - vismaz 1 Lielajam burtam, 1 Ciparam, 1 Simbolam' : null);
      
      setCheckRoleField(formData.role === '' ? 'Lietotāja loma ir obligāta' : null);
      return;
    }

    try {
      const { confirmPassword, ...formDataWithoutConfirmPassword } = formData;

      const response = await fetch('http://localhost:5000/api/users/signup', {method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithoutConfirmPassword)
      });

      if (!response.ok) {
        // Kad reģistrācija nav veiksmīga
        setRegistrationSuccess({
          success: false,
          successMessage: "",
          errorMessage: "Reģistrācija neizdevās. Lūdzu, mēģiniet vēlreiz.",
        });
        throw new Error('Failed to create user');
      };
      
      setRegistrationSuccess({
        success: true,
        successMessage: "Jūsu reģistrācija ir veiksmīga!",
        errorMessage: "",
      });

    } catch (error) {
      // Kad reģistrācija nav veiksmīga
      setRegistrationSuccess({
        success: false,
        successMessage: "",
        errorMessage: "Reģistrācija neizdevās. Lūdzu, mēģiniet vēlreiz.",
      });
      console.error('Error creating user: ', error)
    }
  }
  {/*/ Aizsūtām datus uz serveri */}


  useEffect(() => {
    if (registrationSuccess?.success) {
      const timeoutId = setTimeout(() => {
        reset({
          name: '',
          surname: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone_number: '',
          occupation: '',
          role: '',
        });
        setRegistrationSuccess(null);
      }, 5000); // Pēc 5 sekundēm uzraksts pazudīs
      return () => clearTimeout(timeoutId);
    }
    }, [registrationSuccess?.success]);


  return (
    <DefaultLayout>
      <Breadcrumb pageName="Reģistrācija" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center justify-center">         

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">              
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Reģistrēt lietotāju
              </h2>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Vārds
                  </label>
                  <div className="relative">
                    <input
                      {...register('name')}
                      type="text"
                      placeholder="Lietotāja vārds"
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border border-stroke ${fieldWarnings.name} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                            fill=""
                          />
                          <path
                            d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                    <span className='text-red-500 italic'>{checkNameField}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Uzvārds
                  </label>
                  <div className="relative">
                    <input
                      {...register('surname')}
                      type="text"
                      placeholder="Lietotāja uzvārds"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                            fill=""
                          />
                          <path
                            d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="Lietotāja e-pasts"
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border border-stroke ${fieldWarnings.email} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                    <span className='text-red-500 italic'>{checkEmailField}</span>
                    <span className='text-red-500 italic'>{emailWarning}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Mob. Tel.
                  </label>
                  <div className="relative">
                    <input
                      {...register('phone_number')}
                      type="text"
                      placeholder="Mobilā tālruņa numurs"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <g opacity='0.5'>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                      </g>
                    </svg>

                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Amats
                  </label>
                  <div className="relative">
                    <input
                      {...register('occupation')}
                      type="text"
                      placeholder="Lietotāja ieņemamais amats"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <g opacity='0.5'>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                      </g>
                    </svg>

                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Parole
                  </label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type="password"
                      placeholder="6+ Burti - vismaz 1 Lielais burts, 1 Cipars, 1 Simbols"
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border border-stroke ${fieldWarnings.password} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                            fill=""
                          />
                          <path
                            d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                    <span className='text-red-500 italic'>{checkPasswordField}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Parole atkārtoti
                  </label>
                  <div className="relative">
                    <input
                      {...register('confirmPassword')}
                      type="password"
                      placeholder="Ievadiet paroli atkārtoti"
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border border-stroke ${fieldWarnings.confirmPassword} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                            fill=""
                          />
                          <path
                            d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                    <span className='text-red-500 italic'>{passWarning}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Lietotāja loma
                  </label>
                  <div className="relative">
                    <select
                      {...register('role')}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border border-stroke ${fieldWarnings.role} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    >
                      <option value="">Izvēlieties lietotāja lomu</option>
                      {!showSuperAdminOption ? <option value="superadmin">Galvenais administrators</option> : ""}
                      <option value="admin">Administrators</option>
                      <option value="user">Lietotājs</option>
                    </select>
                  </div>
                  <span className='text-red-500 italic'>{checkRoleField}</span>
                </div>

               {registrationSuccess && (
                  <div className={`flex items-center justify-center mt-6 mb-6 ${registrationSuccess.success ? 'text-green-500' : 'text-red-500'} bold`}>
                    {registrationSuccess.success ? registrationSuccess.successMessage : registrationSuccess.errorMessage}
                  </div>
                )}
          

                <div className="mb-5">
                  <input
                    name='submitButton'
                    type="submit"
                    value="Reģistrēt lietotāju"
                    disabled={!passwordMatch}
                    className={`${submitValidation} w-full rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90`}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SignUp;
