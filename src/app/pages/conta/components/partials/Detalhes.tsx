import React, {useState} from 'react'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import { useAlert, useHelper, useHttpClient } from '../../../../modules/services/Bundle'
import { useAuth } from '../../../../modules/auth'
import { RequestMethod } from '../../../../modules/services/core/_enums'
import { KTSVG, toAbsoluteUrl } from '../../../../../_metronic/helpers'

const Detalhes: React.FC = () => {
  const {auth, saveAuth} = useAuth()
  const helper = useHelper()
  const httpClient = useHttpClient()
  const alert = useAlert()
  
  let [editImage, setImage] = useState(auth?.user?.fotoDataUrl)
  let [userPicture, setPicture] = useState<any>(null)

  const onClickSaveFile = () => {
    if (userPicture != null) {
      httpClient.request({
        method: RequestMethod.POST,
        endpoint: '/Account/ChangeAvatar',
        data: userPicture
      }).then((response) => {
        if(response.success && auth){
          let newAuth = {...auth}
          newAuth.user.fotoDataUrl = response.payload
          saveAuth(newAuth)
        }
      })
    }
  }

  const onChangeFile = async (e:any) => {
    let file = e.target.files[0];
    const base64 = await helper.convertFileToBase64(file)

    setPicture({
      Nome: file.name,
      Extensao: file.name.split('.').pop(),
      Tamanho: file.size,
      Tipo: file.type,
      Base64: base64
    })

    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = function () {
        setImage(reader.result?.toString())
    }.bind(this);
  }

  return (
    <div className='card mb-5 mb-xl-10'>
      <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_profile_details'
        aria-expanded='true'
        aria-controls='kt_account_profile_details'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Detalhes</h3>
        </div>
      </div>

      <div id='kt_account_profile_details' className='collapse show'>
        <form  noValidate className='form'>
          <div className='card-body border-top p-9'>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>Avatar</label>
              <div className='col-lg-8 d-flex align-items-center'>
                  <div
                    className='image-input image-input-outline'
                    data-kt-image-input='true'
                  >
                    <div
                      className='image-input-wrapper w-125px h-125px d-flex justify-content-end'
                      style={{backgroundImage: `url(${editImage ? editImage : toAbsoluteUrl("/media/avatars/blank.png")})`}}
                    >
                    <Stack direction="row" spacing={2}>
                      <IconButton className='p-0 m-0 ' color="primary" aria-label="upload picture" component="label">
                        <input hidden accept="image/*" type="file" onChange={(e) => onChangeFile(e)} />
                            <span title='Editar' className='btn btn-icon p-0 m-0 btn-circle btn-active-color-primary w-25px h-25px bg-white bg-gradient shadow' style={{position: "absolute", top: "-10px", right: "-10px"}}>
                              <KTSVG path="/media/icons/duotune/art/art005.svg" className="svg-icon-muted svg-icon-1hx" />
                            </span>
                      </IconButton>
                    </Stack>
                    {auth?.user?.fotoDataUrl && (
                      <Stack direction="row" spacing={2}>
                        <IconButton className='p-0 m-0 ' onClick={() => {
                          alert.createDialog({
                            html: `Realmente deseja excluir sua foto de perfil?`,
                            confirmAction: async () => {
                              httpClient.request({
                                method: RequestMethod.POST,
                                endpoint: '/Account/ExcluirAvatar'
                              }).then((response) => {
                                if(response.success && auth){
                                  let newAuth = {...auth}
                                  newAuth.user.fotoDataUrl = ''
                                  saveAuth(newAuth)
                                  setImage('')
                                }
                              })
                            }
                          })
                        }} color="primary" aria-label="upload picture" component="label">
                              <span title='Excluir' className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-white bg-gradient shadow' style={{position: "absolute", bottom: "-10px", right: "-10px"}}>
                              <KTSVG path="/media/icons/duotune/general/gen040.svg" className="svg-icon-muted svg-icon-1hx" />
                              </span>
                        </IconButton>
                      </Stack>
                    )}
                    </div>
                  </div>
                  <div className='ms-5'>
                    <button type='button' title='Salvar' className={`btn btn-circle btn-icon  ${editImage === auth?.user?.fotoDataUrl ? "disabled btn-secondary":"btn-primary"}`} onClick={() => onClickSaveFile()} color="primary" aria-label="upload picture">
                      <i className="fa-solid fa-floppy-disk fs-2"></i>
                    </button>
                  </div>
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>Nome Completo</label>

              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      readOnly
                      disabled
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Nome'
                      defaultValue={auth?.user?.nome}
                    />
                  </div>

                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      readOnly
                      disabled
                      className='form-control form-control-lg form-control-solid'
                      placeholder='Sobrenome'
                      defaultValue={auth?.user?.sobrenome}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>Empresa</label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  readOnly
                  disabled
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Empresa'
                  defaultValue={auth?.user?.nomeEmpresa}
                />
              </div>
            </div>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>E-mail</label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  readOnly
                  disabled
                  className='form-control form-control-lg form-control-solid'
                  placeholder='E-mail'
                  defaultValue={auth?.user?.email}
                />
              </div>
            </div>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>Telefone</label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  readOnly
                  disabled
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Telefone'
                  defaultValue={auth?.user?.telefone}
                />
              </div>
            </div>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>Data de Cadastro</label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  readOnly
                  disabled
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Data de Cadastro'
                  defaultValue={auth?.user?.dataCadastro}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export {Detalhes}
