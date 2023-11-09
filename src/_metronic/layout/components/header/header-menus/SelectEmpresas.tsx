/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useAuth } from '../../../../../app/modules/auth'
import { useAlert, useHttpClient } from '../../../../../app/modules/services/Bundle'
import { RequestMethod } from '../../../../../app/modules/services/core/_enums'
import { KTSVG } from '../../../../helpers'

const SelectEmpresas = () => {
  const {auth, saveAuth} = useAuth()
  const httpClient = useHttpClient()
  const alert = useAlert()
  let [empresas, setEmpresas] = useState<any[]>([])
  let [abrirModal, setAbrirModal] = useState(false)
  let [idEmpresaSelecionada, setIdEmpresaSelecionada] = useState(0)
  
  const buscarEmpresas = async () => {
    const response = await httpClient.request({
      method: RequestMethod.GET,
      endpoint: '/Gerenciamento/Empresa/ObterParaSelect',
    })
    if(response.success && response.payload){
        setIdEmpresaSelecionada(response.payload.IdEmpresaSelecionada)
        if(response.payload.Empresas && response.payload.Empresas.length > 0) setEmpresas(response.payload.Empresas)
    }
  }

  const AlterarEmpresaSelecionada = async () => {
    alert.createDialog({
        html: `Realmente deseja alterar a visão de empresa do administrador?`,
        confirmAction: async () => {
            const response = await httpClient.request({
              method: RequestMethod.PUT,
              endpoint: '/Gerenciamento/Empresa/EditarEmpresaSelecionada',
              queryObject: {
                idEmpresa: idEmpresaSelecionada
              }
            })
            if(response.success){
                setAbrirModal(false)
                window.location.reload()
            }
        }
    
    })
  }

  const onChangeSelectEmpresa = (e:any) => {
    const valor = e.target.value
    setIdEmpresaSelecionada(valor ? valor : 0)
  }

  useEffect (() => {
    if (auth && auth.roles.find((x) => x === 'Administrador') !== undefined) {
      buscarEmpresas()
    }
  },[])

  return (
    <>
        <div className='d-flex align-items-center justify-content-end'>
            <button
                onClick={() => setAbrirModal(true)}
                type="button"
                className="btn btn-light-primary"
            >
                Alterar visão empresa
            </button>
        </div>
    
        <div className={`modal ${abrirModal? "show" : ""} fade`} tabIndex={-1} id="kt_modal_1" style={{display: `${abrirModal? "block" : "none"}`}}>
            <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Alterar visão empresa</h5>
                    <div
                    onClick={() => setAbrirModal(false)}
                    className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                    aria-label="Fechar"
                    >
                    <KTSVG
                        path="/media/icons/duotune/arrows/arr061.svg"
                        className="svg-icon svg-icon-2x"
                    />
                    </div>
                </div>
                <div className="modal-body">

                <div className='w-100'>
                    {(auth?.roles.find((x) => x === 'Administrador') !== undefined) && (
                    <div className='w-100'>
                        <label className='text-gray-800 fw-bold mb-2 fs-6'>Empresa Selecionada</label>
                        <select
                            className='form-select form-select-md form-select-solid'
                            onChange={(e) => onChangeSelectEmpresa(e)}
                            value={idEmpresaSelecionada}
                        >
                        <option value=''>Nenhuma...</option>
                        {
                            empresas && empresas.length > 0 ? empresas.map((data: any, index: any) => {
                            return <option key={`idUsuarioMaster-${index}`} value={data.Id}>{data.Dominio}</option>
                            }) : ''
                        }
                        </select>
                    </div>
                    )}
                </div>
                    
                </div>
                <div className="modal-footer">
                    <button
                    onClick={() => setAbrirModal(false)}
                    type="button"
                    className="btn btn-light me-5"
                    >
                        Cancelar
                    </button>

                    <button type='button' onClick={() => AlterarEmpresaSelecionada()} className='btn  btn-primary'>
                        Alterar
                    </button>

                </div>
                </div>
            </div>
        </div>

    </>
  )
}

export {SelectEmpresas}
