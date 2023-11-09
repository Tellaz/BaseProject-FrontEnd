import {FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {InicioPage} from '../pages/inicio/InicioPage'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import {useAuth} from '../modules/auth'
import ContaPage from '../pages/conta/ContaPage'

const PrivateRoutes = () => {
  const {auth, redirect} = useAuth()

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path='/*' element={<Navigate to={`/${redirect}`} />} />
        <Route path='inicio' element={<InicioPage />} />
        <Route path='builder' element={<BuilderPageWrapper />} />
        <Route path='menu-test' element={<MenuTestPage />} />
        <Route
          path='conta/*'
          element={
            <SuspensedView>
              <ContaPage />
            </SuspensedView>
          }
        />        
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
