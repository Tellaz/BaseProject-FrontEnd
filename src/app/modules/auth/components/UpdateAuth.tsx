/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useHttpClient } from '../../services/Bundle'
import { RequestMethod } from '../../services/core/_enums'
import { useAuth } from '../core/Auth'
import { AuthModel } from '../core/_models'

const UpdateAuth = () => {
    const {auth, saveAuth} = useAuth()
    const httpClient = useHttpClient()
    const location = useLocation()

    const buscarAuth = async () => {
        const response = await httpClient.request({
        method: RequestMethod.GET,
        endpoint: '/Account/UpdateAuthModel',
        })
        if(response.success && response.payload){
        const authVM: AuthModel = response.payload
            saveAuth(authVM)
        }
    }
    useEffect(() => {
        if (auth) {
            buscarAuth();
        }
    }, [location])

    return (
        <>
        </>
    )
}

export {UpdateAuth}
