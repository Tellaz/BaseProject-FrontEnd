/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect} from 'react'
import { useAuth } from '../../modules/auth'
import { RequestMethod } from '../../modules/services/core/_enums'
import { useHttpClient } from '../../modules/services/Bundle'

const InicioPage: FC = () => {
  const {auth, saveAuth} = useAuth()
  const user = auth?.user
  const httpClient = useHttpClient()

  useEffect(() => {

    if (!user?.primeiroAcesso) {
        httpClient.request({
          method: RequestMethod.POST,
          endpoint: '/Account/ValidarPrimeiroAcesso',
        }).then((response) => {
          if(response.success && auth){
            let newAuth = {...auth}
            newAuth.user.primeiroAcesso = true
            saveAuth(newAuth)
          }
        })
    }
  }, [])

  return (
    <>
      <h2>Início</h2>

      <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>

        <h1>Bem vindo!</h1>

      </div>
    </>
  )
}

export {InicioPage}
