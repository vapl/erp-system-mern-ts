import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import ProtectedRoute from './components/Routes/ProtectedRoute';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Buttons from './pages/UiElements/Buttons';
import AuthContext from './components/Routes/AuthContext';
import Employees from './pages/Employees';
import DefaultLayout from './layout/DefaultLayout';


const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const { user, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      { !isAuthenticated && <SignIn /> }
      { isAuthenticated && <DefaultLayout>
        <Routes>        
          <Route 
            path="/auth/signup" 
            element={<ProtectedRoute 
              element={<SignUp />} 
              accessRole={['superadmin', 'admin']} />}
          />
          <Route 
            path="/"
            element={ <ProtectedRoute 
              element={user?.role === 'user' ? <Navigate to='/orders' /> : <ECommerce />}
              accessRole={['superadmin', 'admin', 'user']}/>}
          />
          <Route 
            path="/orders" 
            element={<ProtectedRoute 
              element={ <Orders />} 
              accessRole={['superadmin', 'admin', 'user']}/>} />
          <Route 
            path="/calendar" 
            element={<ProtectedRoute 
              element={ <Calendar />} 
              accessRole={['superadmin', 'admin', 'user']}/>} />
          <Route 
            path="/profile" 
            element={<ProtectedRoute 
              element={ <Profile />} 
              accessRole={['superadmin', 'admin', 'user']}/>} />
          <Route 
            path="/forms/form-elements" 
            element={<ProtectedRoute 
              element={ <FormElements />} 
              accessRole={['superadmin', 'admin', 'user']}/>} />
          <Route 
            path="/employees" 
            element={<ProtectedRoute 
              element={ <Employees />} 
              accessRole={['superadmin', 'admin']}/>} />
          <Route 
            path="/forms/form-layouts" 
            element={<ProtectedRoute 
              element={ <FormLayout />} 
              accessRole={['superadmin', 'admin', 'user']}/>} />
          <Route 
            path="/tables" 
            element={<ProtectedRoute 
              element={ <Tables />} 
              accessRole={['superadmin', 'admin', 'user']}/>} />
          <Route 
            path="/settings" 
            element={<ProtectedRoute 
              element={ <Settings />} 
              accessRole={['superadmin', 'admin', 'user']}/>} />
          <Route 
            path="/chart" 
            element={<ProtectedRoute 
              element={ <Chart />} 
              accessRole={['superadmin', 'admin', 'user']}/>} />
          <Route 
            path="/ui/buttons" 
            element={<ProtectedRoute 
              element={ <Buttons />} 
              accessRole={['superadmin', 'admin', 'user']}/>} />                
        </Routes>
      </DefaultLayout> }
    </>
  );
}

export default App;
