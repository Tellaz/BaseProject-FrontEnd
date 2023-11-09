import {Suspense} from 'react'
import {Outlet} from 'react-router-dom'
import {I18nProvider} from '../_metronic/i18n/i18nProvider'
import {LayoutProvider, LayoutSplashScreen} from '../_metronic/layout/core'
import {MasterInit} from '../_metronic/layout/MasterInit'
import {BlockUIProvider} from './modules/services/Bundle'

import './App.css'
import '@availity/block-ui/src/BlockUi.css'
import '@availity/block-ui/dist/index.css'
import 'dropzone/dist/dropzone.css'
import { UpdateAuth } from './modules/auth/components/UpdateAuth'

const App = () => {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <I18nProvider>
        <LayoutProvider>
          <BlockUIProvider>
            <UpdateAuth />
            <Outlet />    
            <MasterInit />         
          </BlockUIProvider>    
        </LayoutProvider>
      </I18nProvider>
    </Suspense>
  )
}

export {App}
