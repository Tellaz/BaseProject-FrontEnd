/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState, useEffect} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, Navigate, useSearchParams} from 'react-router-dom'
import {PasswordMeterComponent} from '../../../../_metronic/assets/ts/components'
import { useHttpClient } from '../../services/Bundle'
import { RequestMethod } from '../../services/core/_enums'

const initialValues = {
  email: '',
  token: '',
  password: '',
  confirmpassword: '',
}

const registrationSchema = Yup.object().shape({  
  password: Yup.string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .max(20, 'A senha deve ter no máximo 20 caracteres')
    // eslint-disable-next-line
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#!?%\-\=\\\/\[\]\{\}\(\)])[0-9a-zA-Z$*&@#!?%\-\=\\\/\[\]\{\}\(\)]{8,20}$/, 'A senha deve ter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 símbolo')
    .required('A senha é obrigatória'),
  confirmpassword: Yup.string()
    .required('A confirmação de senha é obrigatória')
    .when('password', {
      is: (val: string) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('password')], "A senha e a confirmação de senha não conferem"),
    }),  
})

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  initialValues.email = searchParams.get("email") ?? ''
  initialValues.token = searchParams.get("token") ?? ''
  const [loading, setLoading] = useState(false)
  const httpClient = useHttpClient()
  const redirect = searchParams.get('redirect') ?? ''

  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {

        await httpClient.request({
          method: RequestMethod.POST,
          endpoint: '/Account/ResetPassword',
          data: {
            Email: values.email,
            Token: values.token,
            Password: values.password,
            ConfirmPassword: values.confirmpassword,
          },
          ifSuccessRedirectTo: redirect != '' ? `/login?redirect=${redirect}` : '/login'
        })

        setSubmitting(false)
        setLoading(false)
        
      } catch (error) {
        console.error(error)
        setStatus('Dados inválidos')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  useEffect(() => {
    PasswordMeterComponent.bootstrap()
  }, [])

  if(!initialValues.email || !initialValues.token){
    return (
      <Navigate to='*' />
    )
  }

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_signup_form'
      onSubmit={formik.handleSubmit}
    >
      {/* begin::Heading */}
      <div className='text-center mb-11'>
        {/* begin::Title */}
        <h1 className='text-dark fw-bolder mb-3'>Redefinir Senha</h1>
        {/* end::Title */}

        <div className='text-gray-500 fw-semibold fs-6'>Redefina sua senha</div>
      </div>
      {/* end::Heading */}

      {/* begin::Form group Password */}
      <div className='fv-row mb-8' data-kt-password-meter='true'>
        <div className='mb-1'>
          <div className='position-relative mb-3'>
            <input
              type='password'
              placeholder='Senha'
              autoComplete='off'
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.password && formik.errors.password,
                },
                {
                  'is-valid': formik.touched.password && !formik.errors.password,
                }
              )}
            />
            {formik.touched.password && formik.errors.password && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.password}</span>
                </div>
              </div>
            )}
          </div>
          {/* begin::Meter */}
          <div
            className='d-flex align-items-center mb-3'
            data-kt-password-meter-control='highlight'
          >
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px'></div>
          </div>
          {/* end::Meter */}
        </div>
        <div className='text-muted'>
          Use 8 a 20 caracteres com uma mistura de letras, números e símbolos.
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group Confirm password */}
      <div className='fv-row mb-5'>
        <input
          type='password'
          placeholder='Confirmação de senha'
          autoComplete='off'
          {...formik.getFieldProps('confirmpassword')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.confirmpassword && formik.errors.confirmpassword,
            },
            {
              'is-valid': formik.touched.confirmpassword && !formik.errors.confirmpassword,
            }
          )}
        />
        {formik.touched.confirmpassword && formik.errors.confirmpassword && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.confirmpassword}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='text-center'>
        <button
          type='submit'
          id='kt_sign_up_submit'
          className='btn btn-lg btn-primary w-100 mb-5'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Continuar</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Aguarde...{' '}
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <Link to='/login'>
          <button
            type='button'
            id='kt_login_signup_form_cancel_button'
            className='btn btn-lg btn-light-primary w-100 mb-5'
          >
            Cancelar
          </button>
        </Link>
      </div>
      {/* end::Form group */}
    </form>
  )
}
