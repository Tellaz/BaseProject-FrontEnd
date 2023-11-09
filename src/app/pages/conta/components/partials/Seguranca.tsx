/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { useAuth } from '../../../../modules/auth'
import { useAlert, useHttpClient } from '../../../../modules/services/Bundle'
import { RequestMethod } from '../../../../modules/services/core/_enums'
import { KTSVG } from '../../../../../_metronic/helpers'

const initialValues = {
  currentPassword: '',
  newPassword: '',
  passwordConfirmation: '',
}

const passwordFormValidationSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .max(20, 'A senha deve ter no máximo 20 caracteres')
    // eslint-disable-next-line
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#!?%\-\=\\\/\[\]\{\}\(\)])[0-9a-zA-Z$*&@#!?%\-\=\\\/\[\]\{\}\(\)]{8,20}$/, 'A senha deve ter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 símbolo')
    .required('A senha é obrigatória'),
  newPassword: Yup.string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .max(20, 'A senha deve ter no máximo 20 caracteres')
    // eslint-disable-next-line
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#!?%\-\=\\\/\[\]\{\}\(\)])[0-9a-zA-Z$*&@#!?%\-\=\\\/\[\]\{\}\(\)]{8,20}$/, 'A senha deve ter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 símbolo')
    .required('A senha é obrigatória'),
  passwordConfirmation: Yup.string()
  .required('A confirmação de senha é obrigatória')
  .when('newPassword', {
    is: (val: string) => (val && val.length > 0 ? true : false),
    then: Yup.string().oneOf([Yup.ref('newPassword')], "A senha e a confirmação de senha não conferem"),
  })
})

const Seguranca: React.FC = () => {
  const {auth, saveAuth} = useAuth()
  const httpClient = useHttpClient()
  const alert = useAlert()

  const [showPasswordForm, setPasswordForm] = useState<boolean>(false)

  const [loading, setLoading] = useState(false)
  const [securityActive, setSecurityActive] = useState(auth?.user.twoFactorEnabled)

  const alterarDoisFatores = () => {
    try {
      httpClient.request({
        method: RequestMethod.POST,
        endpoint: '/Account/AlterarDoisFatores'
      }).then((result) => {
        if (result.success && auth) {
          setSecurityActive(!securityActive)
          let newAuth = {...auth}
          newAuth.user.twoFactorEnabled = !securityActive
          saveAuth(newAuth)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema: passwordFormValidationSchema,
    onSubmit: async (values, {setStatus, setSubmitting, resetForm }) => {
      setLoading(true)
      try {
        await httpClient.request({
          method: RequestMethod.POST,
          endpoint: '/Account/ChangePassword',
          data: {
            CurrentPassword: values.currentPassword,
            NewPassword: values.newPassword,
            ConfirmNewPassword: values.passwordConfirmation,
          }
        }).then((result) => {
          setSubmitting(false)
          setLoading(false)
          if (result.success) {
            setPasswordForm(false)
            resetForm()
          }
        })
        
      } catch (error) {
        console.error(error)
        setStatus('Dados inválidos')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  return (
    <div className='card mb-5 mb-xl-10'>
      <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_signin_method'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Segurança</h3>
        </div>
      </div>

      <div id='kt_account_signin_method' className='collapse show'>
        <div className='card-body border-top p-9'>
          <div className='d-flex flex-wrap align-items-center'>
            <div id='kt_signin_email'>
              <div className='fs-6 fw-bolder mb-1'>E-mail</div>
              <div className='fw-bold text-gray-600'>{auth?.user?.email}</div>
            </div>
          </div>

          <div className='separator separator-dashed my-6'></div>

          <div className='d-flex flex-wrap align-items-center mb-10'>
            <div id='kt_signin_password' className={' ' + (showPasswordForm && 'd-none')}>
              <div className='fs-6 fw-bolder mb-1'>Senha</div>
              <div className='fw-bold text-gray-600'>************</div>
            </div>

            <div
              id='kt_signin_password_edit'
              className={'flex-row-fluid ' + (!showPasswordForm && 'd-none')}
            >
              <form
                onSubmit={formik.handleSubmit}
                id='kt_signin_change_password'
                className='form'
                noValidate
              >
                <div className='row mb-1'>
                  <div className='col-lg-4'>
                    <div className='fv-row mb-0'>
                      <label htmlFor='currentpassword' className='form-label fs-6 fw-bolder mb-3'>
                        Senha Atual
                      </label>
                      <input
                        type='password'
                        className='form-control form-control-lg form-control-solid '
                        id='currentpassword'
                        {...formik.getFieldProps('currentPassword')}
                      />
                      {formik.touched.currentPassword && formik.errors.currentPassword && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.currentPassword}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='col-lg-4'>
                    <div className='fv-row mb-0'>
                      <label htmlFor='newpassword' className='form-label fs-6 fw-bolder mb-3'>
                        Nova Senha
                      </label>
                      <input
                        type='password'
                        className='form-control form-control-lg form-control-solid '
                        id='newpassword'
                        {...formik.getFieldProps('newPassword')}
                      />
                      {formik.touched.newPassword && formik.errors.newPassword && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.newPassword}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='col-lg-4'>
                    <div className='fv-row mb-0'>
                      <label htmlFor='confirmpassword' className='form-label fs-6 fw-bolder mb-3'>
                        Confirme Nova Senha
                      </label>
                      <input
                        type='password'
                        className='form-control form-control-lg form-control-solid '
                        id='confirmpassword'
                        {...formik.getFieldProps('passwordConfirmation')}
                      />
                      {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.passwordConfirmation}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='form-text mb-5'>
                  Use 8 a 20 caracteres com uma mistura de letras, números e símbolos.
                </div>

                <div className='d-flex'>
                  <button
                    id='kt_password_submit'
                    type='submit'
                    className='btn btn-primary me-2 px-6'
                  >
                    {!loading && 'Editar Senha'}
                    {loading && (
                      <span className='indicator-progress' style={{display: 'block'}}>
                        Aguarde...{' '}
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setPasswordForm(false)
                    }}
                    id='kt_password_cancel'
                    type='button'
                    className='btn btn-color-gray-400 btn-active-light-primary px-6'
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>

            <div
              id='kt_signin_password_button'
              className={'ms-auto ' + (showPasswordForm && 'd-none')}
            >
              <button
                onClick={() => {
                  setPasswordForm(true)
                }}
                className='btn btn-light btn-active-light-primary'
              >
                Alterar Senha
              </button>
            </div>
          </div>

          <div className='notice d-flex bg-light-primary rounded border-primary border border-dashed p-6'>
            <KTSVG
              path='/media/icons/duotune/general/gen048.svg'
              className='svg-icon-2tx svg-icon-primary me-4'
            />
            <div className='d-flex flex-stack flex-grow-1 flex-wrap flex-md-nowrap'>
              <div className='mb-3 mb-md-0 fw-bold'>
                <h4 className='text-gray-800 fw-bolder'>Proteja sua conta</h4>
                <div className='fs-6 text-gray-600 pe-7'>
                  A autenticação de dois fatores adiciona uma camada extra de segurança à sua conta. Necessita conectar
                  em sua conta, além disso, você precisará fornecer um código de 6 dígitos
                </div>
              </div>

              {!securityActive && (
                <button
                type='button'
                onClick={() => {
                  alert.createDialog({
                    html: `Realmente deseja habilitar autenticação em dois fatores?`,
                    confirmAction: async () => {
                      alterarDoisFatores()
                    }
                  })
                }}
                className='btn btn-primary px-6 align-self-center text-nowrap'
                >
                  Habilitar
                </button>
              )}
              {securityActive && (
                <button
                type='button'
                onClick={() => {
                  alert.createDialog({
                    html: `Realmente deseja dasabilitar autenticação em dois fatores?`,
                    confirmAction: async () => {
                      alterarDoisFatores()
                    }
                  })
                }}
                className='btn btn-danger px-6 align-self-center text-nowrap'
                >
                  Desabilitar
                </button>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {Seguranca}
