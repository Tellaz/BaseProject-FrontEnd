/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, useNavigate} from 'react-router-dom'
import {useFormik} from 'formik'
import {useAuth} from '../core/Auth'
import {useHttpClient} from '../../services/Bundle'
import {AuthModel} from '../core/_models'
import {RequestMethod} from '../../services/core/_enums'
import IconButton from '@mui/material/IconButton'

const loginSchema = Yup.object().shape({
  email: Yup.string().email('E-mail inválido').required('O e-mail é obrigatório'),
  password: Yup.string().required('A senha é obrigatória'),
})

const initialValues = {
  email: '',
  password: '',
}

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function Login() {
  const [loading, setLoading] = useState(false)
  const {saveAuth} = useAuth()
  const navigate = useNavigate()
  const httpClient = useHttpClient()
  const [senhaErrada, setSenhaErrada] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const urlParams = new URLSearchParams(window.location.search)
  const redirect = urlParams.get('redirect')

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        const response = await httpClient.request({
          method: RequestMethod.POST,
          endpoint: '/Account/SignIn',
          data: {
            Email: values.email,
            Password: values.password,
          },
        })

        if (response.success && response.payload) {
          if (response.payload === 'two-steps') {
            return navigate('/two-steps', {
              state: {
                username: values.email,
                redirect: redirect,
              },
            })
          } else {
            const auth: AuthModel = response.payload
            saveAuth(auth)
          }
        } else setSenhaErrada(true)

        setSubmitting(false)
        setLoading(false)
      } catch (error) {
        console.error(error)
        saveAuth(undefined)
        setStatus('Dados inválidos')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  useEffect(() => {
    if (formik.isValidating) {
      setSenhaErrada(false)
    }
  }, [formik])

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      {/* begin::Heading */}
      <div className='text-center mb-11'>
        <h1 className='text-dark fw-bolder mb-3'>Entrar</h1>
        <div className='text-gray-500 fw-semibold fs-6'>Acesse sua conta</div>
      </div>
      {/* begin::Heading */}

      {/* begin::Form group */}
      <div className='fv-row mb-8'>
        <input
          placeholder='E-mail'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control bg-transparent',
            {'is-invalid': (formik.touched.email && formik.errors.email) || senhaErrada},
            {
              'is-valid': formik.touched.email && !formik.errors.email && senhaErrada === false,
            }
          )}
          type='email'
          name='email'
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-3'>
        <div className='wrapper-olho'>
          <div className={`${formik.touched.password ? 'icon-olho-distancia-maior' : 'icon-olho'}`}>
            <IconButton
              aria-label='visualizar senha'
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge='end'
            >
              {showPassword ? <i className='fas fa-eye'></i> : <i className='fas fa-eye-slash'></i>}
            </IconButton>
          </div>
          <input
            placeholder='Senha'
            type={showPassword ? 'text' : 'password'}
            {...formik.getFieldProps('password')}
            className={clsx(
              'form-control bg-transparent',
              'input-olho',
              {
                'is-invalid': (formik.touched.password && formik.errors.password) || senhaErrada,
              },
              {
                'is-valid':
                  formik.touched.password && !formik.errors.password && senhaErrada === false,
              }
            )}
          />
        </div>

        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Wrapper */}
      <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
        <div />

        {/* begin::Link */}
        <Link
          to='/forgot-password'
          state={{email: formik.values.email, redirect: redirect}}
          className='link-primary'
          id='esqueci-senha'
        >
          Esqueceu sua senha ?
        </Link>
        {/* end::Link */}
      </div>
      {/* end::Wrapper */}

      {/* begin::Action */}
      <div className='d-grid mb-10'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-primary'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Continuar</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Aguarde...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Action */}

      <div className='text-gray-500 text-center fw-semibold fs-6'>
        Ainda não é cliente?{' '}
        <Link
          to='/registration'
          id='registration'
          state={{redirect: redirect}}
          className='link-primary'
        >
          Cadastre-se
        </Link>
      </div>
    </form>
  )
}
