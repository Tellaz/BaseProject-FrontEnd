import {FC, useState, createContext, useContext} from 'react'
import {AuthModel} from './_models'
import * as authHelper from './AuthHelpers'
import {WithChildren} from '../../../../_metronic/helpers'

type AuthContextProps = {
  auth: AuthModel | undefined
  saveAuth: (auth: AuthModel | undefined) => void
  logout: () => void
  redirect: string
}

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  logout: () => {},
  redirect: 'inicio',
}

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider: FC<WithChildren> = ({children}) => {
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth())

  const urlParams = new URLSearchParams(window.location.search)
  const redirect = urlParams.get('redirect') || 'inicio'

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth)
    if (auth) {
      authHelper.setAuth(auth)
    } else {
      authHelper.removeAuth()
    }
  }

  const logout = () => {
    saveAuth(undefined)
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie =
      '.AspNetCore.Identity.Application=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }

  return (
    <AuthContext.Provider value={{auth, saveAuth, logout, redirect}}>
      {children}
    </AuthContext.Provider>
  )
}

export {AuthProvider, useAuth}
