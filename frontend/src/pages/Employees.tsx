import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import ModalDialog from '../components/Modals/ModalDialog';
import PageTitle from '../components/PageTitle';
import DeleteIcon from '../images/icon/icon-delete.svg';
import PenIcon from '../images/icon/icon-pen.svg';
import PlusIcon from '../images/icon/icon-plus';
import { Order } from '../models/orders';
import { User } from '../models/user';
import * as OrdersApi from '../network/orders_api';
import * as UsersApi from '../network/users_api';
import UserProfileImage from './UiElements/UserProfileImage';
import SignUp from './Authentication/SignUp';
import EditUser from './Authentication/EditUser';

const Employees: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addUser, setAddUser] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');
  
  useEffect (() => {
    const loadUsers = async () => {
      const getUsers = await UsersApi.getAllUsersData();
      setUsers(getUsers);
    };
    loadUsers();
    
  }, []);

  useEffect (() => {
    const loadOrders = async () => {
      const getOrders = await OrdersApi.getOrders();
      setOrders(getOrders);
    }
    loadOrders();
  }, []);

  const invoiceTotalCount = (userId: string) => {
    let invoiceTotal: number = 0;
    orders.map(order => {
      if (userId === order.user[0]) {
        invoiceTotal += order.invoice_total;
      }
    });
    return invoiceTotal;
  };

  const deleteUser = async (userId: string) => {
    try {
      await UsersApi.deleteUser(userId);
      
      const updatedUser = users.filter(user => user._id !== userId);
      setUsers(updatedUser);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <ModalDialog 
        open={addUser} 
        setOpen={setAddUser}
        title='Reģistrācija'
        content={<SignUp />}
      />
      <ModalDialog 
        open={editUser} 
        setOpen={setEditUser}
        title='Rediģēšana'
        content={<EditUser userId={userId} open={editUser} />}
      />
      <PageTitle title="Darbinieki" />
      <Breadcrumb pageName="Darbinieki" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex flex-grow justify-between py-6 px-4 md:px-6 xl:px-7.5">
            <div className="mb-3 xl:w-96">
              <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                  <input
                      type="search"
                      className="relative m-0 block flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="button-addon2" />

                  {/* <!--Search icon--> */}
                  <span
                      className="input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-200"
                      id="basic-addon2">
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-5 w-5">
                          <path
                              fillRule="evenodd"
                              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                              clipRule="evenodd" />
                      </svg>
                  </span>
                </div>
            </div>
            <a href="#" onClick={() => {setAddUser(true)}} className="text-primary" >
              <PlusIcon />
            </a>            
          </div>

        <div className="flex flex-col">
            <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">
              <div className="p-2.5 xl:p-5 w-50">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Darbinieks
                  </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Amats
                  </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Lietotāja statuss
                  </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Pasūtīumu skaits
                  </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Pasūtījumu ieņēmumi
                  </h5>
              </div>
            </div>

            {users.map((user, key) => (
            <div
                className={`grid grid-cols-3 sm:grid-cols-6 ${
                key === users.length
                    ? ''
                    : 'border-b border-stroke dark:border-strokedark'
                }`}
                key={key}
            >
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0">
                      <div className="h-14 w-14 rounded-full overflow-hidden">
                        <UserProfileImage imageName={user?.profile_image}/>
                      </div>
                  </div>
                  <div className='flex flex-col items-start'>
                    <p className="hidden text-black dark:text-white sm:block font-bold">
                      {user.name} {user.surname}
                    </p>
                    <p className="hidden text-black dark:text-white sm:block text-sm text-slate-400">
                      {user.email}
                    </p>
                    <p className="hidden text-black dark:text-white sm:block text-sm text-slate-400">
                      {user.phone_number}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{user.occupation}</p>
                </div>
                {/* User Role */}
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black">
                    {user.role}
                  </p>
                </div>
                {/* Order count */}
                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="text-black dark:text-white">{user.orders.length}</p>
                </div>
                {/* Revenue */}
                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="text-black">{invoiceTotalCount(user._id)} €</p>
                </div>
                <div className="hidden items-center justify-end p-2.5 sm:flex xl:p-5 flex-shrink-0">
                  <div className='flex gap-4'>
                    <a className='w-5 h-5' href='#' onClick={() => {
                      setUserId(user._id);
                      setEditUser(true)
                    }}><img src={PenIcon} alt="edit-user" /></a>
                    <a className='w-5 h-5' href='#' onClick={() => deleteUser(user._id)}><img src={DeleteIcon} alt="delete-image" /></a>
                  </div>
                </div>
            </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Employees;
