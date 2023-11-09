import {Navigate, Route, Routes} from 'react-router-dom'
import {Registration} from './components/Registration'
import {ForgotPassword} from './components/ForgotPassword'
import {Login} from './components/Login'
import {AuthLayout} from './AuthLayout'
import {TwoSteps} from './components/TwoSteps'
import { ResetPassword } from './components/ResetPassword'
import { Termos } from './components/Termos'

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path='login' element={<Login />} />
      <Route path='two-steps' element={<TwoSteps />} />
      <Route path='termos' element={<Termos />} />
      <Route path='registration' element={<Registration />} />
      <Route path='forgot-password' element={<ForgotPassword />} />
      <Route path='reset-password' element={<ResetPassword />} />
      {/* Page Not Found */}
      <Route path='*' element={<Navigate to='/error/404' />} />
      <Route index element={<Login />} />
    </Route>
  </Routes>
)

export {AuthPage}
