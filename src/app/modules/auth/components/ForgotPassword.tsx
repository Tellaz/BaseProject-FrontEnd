import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, useLocation} from 'react-router-dom'
import {useFormik} from 'formik'
import {useHttpClient} from '../../services/Bundle'
import {RequestMethod} from '../../services/core/_enums'

const initialValues = {
  email: '',
}

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('E-mail inválido').required('O e-mail é obrigatório'),
})

export function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const httpClient = useHttpClient()
  const location = useLocation()
  const state: any = location.state

  initialValues.email = state?.email ?? ''
  const redirect = state?.redirect ?? '/'

  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        await httpClient.request({
          method: RequestMethod.POST,
          endpoint: '/Account/ForgotPassword',
          data: {
            Email: values.email,
            Redirect: redirect
          },
          ifSuccessRedirectTo: redirect != '/' ? `/login?redirect=${redirect}` : '/',
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

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_password_reset_form'
      onSubmit={formik.handleSubmit}
    >
      <div className='text-center mb-10'>
        {/* begin::Title */}
        <h1 className='text-dark fw-bolder mb-3'>Esqueceu sua senha ?</h1>
        {/* end::Title */}

        {/* begin::Link */}
        <div className='text-gray-500 fw-semibold fs-6'>
          Insira seu e-mail para resetar sua senha.
        </div>
        {/* end::Link */}
      </div>

      {/* begin::Form group */}
      <div className='fv-row mb-8'>
        <input
          type='email'
          placeholder='E-mail'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control bg-transparent',
            {'is-invalid': formik.touched.email && formik.errors.email},
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
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
      <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
        <button
          type='submit'
          id='kt_password_reset_submit'
          className='btn btn-primary me-4'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Enviar</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Aguarde...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <Link to='/login'>
          <button
            type='button'
            id='kt_login_password_reset_form_cancel_button'
            className='btn btn-light-primary'
          >
            Cancelar
          </button>
        </Link>{' '}
      </div>
      {/* end::Form group */}
    </form>
  )
}
