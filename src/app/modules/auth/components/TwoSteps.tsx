/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, Navigate, useLocation} from 'react-router-dom'
import {useFormik} from 'formik'
import {useAuth} from '../core/Auth'
import {useHttpClient} from '../../services/Bundle'
import {AuthModel} from '../core/_models'
import InputMask from 'react-input-mask'
import {RequestMethod} from '../../services/core/_enums'

const twoStepsSchema = Yup.object().shape({
  username: Yup.string().required(),
  code: Yup.string()
    .test('Código', 'Código inválido', (val = '') => {
      if (!val) return true
      return val.replace(/\D/g, '').length === 6
    })
    .required('O código é obrigatório'),
})

const initialValues = {
  username: '',
  code: '',
}

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function TwoSteps() {
  const [loading, setLoading] = useState(false)
  const {saveAuth} = useAuth()
  const httpClient = useHttpClient()
  const location = useLocation()
  const state: any = location.state

  initialValues.username = state?.username ?? ''

  const formik = useFormik({
    initialValues,
    validationSchema: twoStepsSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        const response = await httpClient.request({
          method: RequestMethod.POST,
          endpoint: '/Account/TwoSteps',
          ifSuccessRedirectTo: state.redirect ? `/${state.redirect}` : '/inicio',
          data: {
            UserName: values.username,
            Code: values.code.replace(/\D/g, ''),
          },
        })

        if (response.success && response.payload) {
          const auth: AuthModel = response.payload
          saveAuth(auth)
        }

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

  const hideEmail = (email: string) => {
    return email.replace(/(.{2})(.*)(?=@)/, (gp1, gp2, gp3) => {
      for (let i = 0; i < gp3.length; i++) {
        gp2 += '*'
      }
      return gp2
    })
  }

  const onClickReenviar = async (e: any) => {
    e.preventDefault()

    await httpClient.request({
      method: RequestMethod.POST,
      endpoint: '/Account/ResendSecurityCode',
      data: {
        UserName: formik.values.username,
      },
    })
  }

  if (!state) {
    return <Navigate to='/login' />
  }

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_two_steps_form'
    >
      {/* begin::Heading */}

      <div className='text-center mb-10'>
        <span className='svg-icon'>
          <svg
            style={{
              width: '10rem',
              height: '10rem',
            }}
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              opacity='0.3'
              d='M21 19H3C2.4 19 2 18.6 2 18V6C2 5.4 2.4 5 3 5H21C21.6 5 22 5.4 22 6V18C22 18.6 21.6 19 21 19Z'
              fill='currentColor'
            />
            <path
              d='M21 5H2.99999C2.69999 5 2.49999 5.10005 2.29999 5.30005L11.2 13.3C11.7 13.7 12.4 13.7 12.8 13.3L21.7 5.30005C21.5 5.10005 21.3 5 21 5Z'
              fill='currentColor'
            />
          </svg>
        </span>
      </div>

      <div className='text-center mb-10'>
        <h1 className='text-dark fw-bolder mb-3'>Verificação em duas etapas</h1>
        <div className='text-gray-500 fw-semibold fs-6'>
          Digite o código de verificação que enviamos para
        </div>

        <div className='fw-bold text-dark fs-3 mt-5'>{hideEmail(initialValues.username)}</div>
      </div>
      {/* begin::Heading */}

      <div className='mb-8'>
        <div className='fw-bold text-start text-dark fs-6 mb-2 ms-1'>
          Digite seu código de segurança de 6 digitos
        </div>

        <div className='d-flex flex-wrap flex-stack'>
          <InputMask
            mask={'9 9 9 9 9 9'}
            alwaysShowMask={true}
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('code')}
            className={clsx(
              'form-control bg-transparent fs-1 text-center',
              {
                'is-invalid': formik.touched.code && formik.errors.code,
              },
              {
                'is-valid': formik.touched.code && !formik.errors.code,
              }
            )}
            style={{
              backgroundImage: 'none',
              paddingRight: '1rem',
            }}
          ></InputMask>
          {formik.touched.code && formik.errors.code && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.code}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* begin::Action */}
      <div className='d-grid mb-10'>
        <button
          type='submit'
          id='kt_two_steps_submit'
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
        Não recebeu o código?{' '}
        <Link to='' onClick={onClickReenviar} className='link-primary'>
          Reenviar
        </Link>
      </div>
    </form>
  )
}
