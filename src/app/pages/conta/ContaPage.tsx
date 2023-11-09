import {Navigate, Routes, Route, Outlet} from 'react-router-dom'
import { ArrayBreadcrumb, BreadcrumbLayout } from '../../modules/services/core/Breadcrumb'
import { Perfil } from './components/Perfil'
import { useAuth } from '../../modules/auth'
import { Uploads } from './components/Uploads'
import { Downloads } from './components/Downloads'

const profileBreadCrumbs: Array<ArrayBreadcrumb> = [
  {
    titulo: 'Conta',
    path: '',
  }
]

const ContaPage = () => {
  const {auth, logout} = useAuth()

  return (
    <Routes>
      <Route
        element={
          <>
            <Outlet />
          </>
        }
      >
        <Route
          path='perfil'
          element={
            <>
              <BreadcrumbLayout props={profileBreadCrumbs}>Perfil</BreadcrumbLayout>
              <Perfil />
            </>
          }
        />
        <Route
          path='uploads'
          element={
            <>
              <BreadcrumbLayout props={profileBreadCrumbs}>Uploads</BreadcrumbLayout>
              <Uploads />
            </>
          }
        />

        <Route
          path='downloads'
          element={
            <>
              <BreadcrumbLayout props={profileBreadCrumbs}>Downloads</BreadcrumbLayout>
              <Downloads />
            </>
          }
        />
        <Route path='*' element={<Navigate to='/inicio' />} />   
        <Route index element={<Navigate to='/conta/perfil' />} />
      </Route>
    </Routes>
  )
}

export default ContaPage
