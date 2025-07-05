
import Home from '../pages/Home'
import Login from '../pages/Login'
import Services from '../pages/Services'
import Signup from '../pages/Signup'
import Contact from '../pages/Contact'
import Experts from '../pages/Experts/Expert'
import ExpertsDetails from '../pages/Experts/ExpertDetails'
import CheckoutSuccess from '../pages/CheckoutSuccess'
import VidChat from '../pages/VidChat';
import { Routes, Route } from 'react-router-dom'
import MyAccount from '../Dashboard/user-account/MyAccount'
import Dashboard from '../Dashboard/expert-account/Dashboard'
import ProtectedRoute from "./ProtectedRoute"
import GoogleTranslate from '../components/translator/GoogleTranslate';
import AdminDashboard from '../pages/admin/AdminDashboard';
import Detailed from '../pages/admin/Detailed';

const Routers = () => {
  return <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/home' element={<Home />} />
    <Route path='/experts' element={<Experts />} />
    <Route path='/experts/:id' element={<ExpertsDetails />} />
    <Route path='/login' element={<Login />} />
    <Route path='/register' element={<Signup />} />
    <Route path='/contact' element={<Contact />} />
    <Route path='/services' element={<Services />} />
    <Route path='/checkout-success' element={<CheckoutSuccess />} />
    <Route path='/vid_chat' element={<VidChat />} />
    <Route path='/GoogleTranslate' element={<GoogleTranslate />} />
    <Route
      path="/users/profile/me"
      element={
        <ProtectedRoute allowedRoles={["client"]}>
          <MyAccount/>
        </ProtectedRoute>
      }
    />
    <Route
      path="/experts/profile/me"
      element={
        <ProtectedRoute allowedRoles={["expert"]}>
          <Dashboard/>
        </ProtectedRoute>

      }
    />
    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard/>
        </ProtectedRoute>

      }
    />
    <Route
      path="/appointment/:id"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <Detailed/>
        </ProtectedRoute>

      }
    />
  </Routes>
};

export default Routers;
