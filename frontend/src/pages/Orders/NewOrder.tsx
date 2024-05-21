import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Alert from '../../components/Alerts/Alert';
import SubmitButton from '../../components/Forms/SubmitButton';
import TextInputField from '../../components/Forms/TextInputField';
import { Order } from '../../models/orders';
import * as OrdersApi from '../../network/orders_api';


const NewOrder: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<OrdersApi.CreateOrderCredentials>();
  const [open, setOpen] = useState<boolean>(false);

  {/*Funkcija kas pārbauda vai ievadītais reģistrācijas numurs jau eksistē, 
  ja eksistē, parāda kļūdas paziņojumu*/}
  const getOrdersList = async (value: string, message: string) => {
    const orders: Order[] = await OrdersApi.getOrders();
    const regNumbers = orders.map(order => order.reg_num);
    const regNumExists = regNumbers.some(regNum => regNum === value)
    return regNumExists ? message : true;
  }
  
  const onSubmit = async (credentials: OrdersApi.CreateOrderCredentials) => {    
    try {
      await OrdersApi.createOrder(credentials);
      setOpen(true);

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
              Jauns pasūtījums
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextInputField 
                name='reg_num'
                label='Pasūtījuma Nr.'
                type='text'
                placeholder='Pasūtījuma reģistrācijas numurs'
                register={register}
                registerOptions={{ 
                  required: 'Reģistrācijas numurs ir obligāts', 
                  validate: value => getOrdersList(value, 'Šāds numurs jau ir reģistrēts, izvēlaties citu.')
                }}
                error={errors.reg_num}
                // svg={<EnvelopeIcon />}
              />
              <TextInputField 
                name='order_name'
                label='Pasūtījuma nosaukums'
                type='text'
                placeholder='Pasūtījuma nosaukums'
                register={register}
                registerOptions={{ 
                  required: 'Pasūtījuma nosaukums ir obligāts'
                }}
                error={errors.order_name}
                // svg={<EnvelopeIcon />}
              />
              <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                <input
                  className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                  type="checkbox"
                  value=""
                  id="order_export" />
                <label
                  className="inline-block pl-[0.15rem] hover:cursor-pointer"
                  htmlFor="order_export">
                  Eksports
                </label>
              </div>
              <Alert 
                successText='Pasūtījums saglabāts veiksmīgi'
                errorText='Pasūtījums netika saglabāts'
                success={open}
              />
              <div className='flex gap-4 justify-between'>

                {/* <SubmitButton
                  className='w-100 bg-neutral-400 border-neutral-400'
                  name='dismiss'
                  type='submit'
                  value='Atcelt'
                  register={register}
                /> */}
                <SubmitButton
                  className='w-100'
                  name='submit'
                  type='submit'
                  value='Saglabāt'
                  disabled={isSubmitting}
                  register={register}
                  registerOptions={{required: 'Reģistrācija neizdevās, mēģieniet vēlreiz'}}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewOrder;
