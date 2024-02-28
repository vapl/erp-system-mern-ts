import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import ProtectedRoute from './components/Routes/ProtectedRoute';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import ECommerce from './pages/Dashboard/ECommerce';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Tables from './pages/Tables';
import Settings from './pages/Settings';
import Chart from './pages/Chart';
import Buttons from './pages/UiElements/Buttons';


const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
      <Routes>
        <Route path="/auth/signin" element={ <SignIn /> } />
        <Route 
          path="/auth/signup" 
          element={<ProtectedRoute 
            element={<SignUp onSignUpSuccessfull={() => {  }} />} 
            accessRole={['superadmin', 'admin']} />} 
        />
        <Route 
          path="/" 
          element={ <ProtectedRoute 
            element={<ECommerce />}
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
  );
}

export default App;
