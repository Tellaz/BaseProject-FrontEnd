/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState, useEffect} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, useLocation} from 'react-router-dom'
import {PasswordMeterComponent} from '../../../../_metronic/assets/ts/components'
import InputMask from 'react-input-mask'
import {useHttpClient, useValidation} from '../../services/Bundle'
import {RequestMethod} from '../../services/core/_enums'
import IconButton from '@mui/material/IconButton'

const initialValues = {
  firstname: '',
  lastname: '',
  email: '',
  cellphone: '',
  password: '',
  confirmpassword: '',
  acceptTerms: false,
}

const registrationSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(50, 'O nome deve ter no máximo 50 caracteres')
    .required('O nome é obrigatório'),
  lastname: Yup.string()
    .min(3, 'O sobrenome deve ter no mínimo 3 caracteres')
    .max(50, 'O sobrenome deve ter no máximo 50 caracteres')
    .required('O sobrenome é obrigatório'),
  email: Yup.string()
    .email('E-mail inválido')
    .test('company-email', 'O e-email deve ser corporativo', (val = '') => {
      if (!val) return true
      const validation = useValidation()
      return validation.CompanyEmail(val)
    })
    .min(3, 'O e-mail deve ter no mínimo 3 caracteres')
    .max(80, 'O e-mail deve ter no máximo 80 caracteres')
    .required('O e-mail é obrigatório'),
  cellphone: Yup.string()
    .test('Telefone', 'Telefone inválido', (val = '') => {
      if (!val) return true
      return val.replace(/\D/g, '').length === 11
    })
    .required('O telefone é obrigatório'),
  password: Yup.string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .max(20, 'A senha deve ter no máximo 20 caracteres')
    // eslint-disable-next-line
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#!?%\-\=\\\/\[\]\{\}\(\)])[0-9a-zA-Z$*&@#!?%\-\=\\\/\[\]\{\}\(\)]{8,20}$/,
      'A senha deve ter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 símbolo'
    )
    .required('A senha é obrigatória'),
  confirmpassword: Yup.string()
    .required('A confirmação de senha é obrigatória')
    .when('password', {
      is: (val: string) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref('password')],
        'A senha e a confirmação de senha não conferem'
      ),
    }),
  acceptTerms: Yup.bool().required('Você deve aceitar os termos e condições'),
})

export function Registration() {
  const [loading, setLoading] = useState(false)
  const httpClient = useHttpClient()
  const location = useLocation()

  const state: any = location.state

  const redirect = state?.redirect ?? ''


  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        await httpClient.request({
          method: RequestMethod.POST,
          endpoint: '/Account/SignUp',
          data: {
            Nome: values.firstname,
            Sobrenome: values.lastname,
            Email: values.email,
            Telefone: values.cellphone.replace(/\D/g, ''),
            Password: values.password,
            ConfirmPassword: values.confirmpassword,
          },
          ifSuccessRedirectTo: redirect ? `/login?redirect=${redirect}` : '/login',
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

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

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
        <h1 className='text-dark fw-bolder mb-3'>Cadastro</h1>
        {/* end::Title */}

        <div className='text-gray-500 fw-semibold fs-6'>Crie sua conta</div>
      </div>
      {/* end::Heading */}

      {/* begin::Form group Firstname */}
      <div className='fv-row mb-8'>
        <input
          placeholder='Nome'
          type='text'
          {...formik.getFieldProps('firstname')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.firstname && formik.errors.firstname,
            },
            {
              'is-valid': formik.touched.firstname && !formik.errors.firstname,
            }
          )}
        />
        {formik.touched.firstname && formik.errors.firstname && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.firstname}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group Lastname */}
      <div className='fv-row mb-8'>
        <input
          placeholder='Sobrenome'
          type='text'
          {...formik.getFieldProps('lastname')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.lastname && formik.errors.lastname,
            },
            {
              'is-valid': formik.touched.lastname && !formik.errors.lastname,
            }
          )}
        />
        {formik.touched.lastname && formik.errors.lastname && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.lastname}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group Email */}
      <div className='fv-row mb-8'>
        <input
          placeholder='E-mail'
          type='email'
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

      {/* begin::Form group Cellphone */}
      <div className='fv-row mb-8'>
        <InputMask
          mask={'(99) 99999-9999'}
          placeholder='Telefone'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('cellphone')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.cellphone && formik.errors.cellphone,
            },
            {
              'is-valid': formik.touched.cellphone && !formik.errors.cellphone,
            }
          )}
        ></InputMask>
        {formik.touched.cellphone && formik.errors.cellphone && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.cellphone}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group Password */}
      <div className='fv-row mb-8' data-kt-password-meter='true'>
        <div className='mb-1'>
          <div className='position-relative mb-3'>

            <div className="wrapper-olho">
              <div className={`${formik.touched.password ? "icon-olho-distancia-maior" : "icon-olho"}`}>
                <IconButton
                  aria-label="visualizar senha"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ?<i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                </IconButton>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Senha'
                autoComplete='off'
                {...formik.getFieldProps('password')}
                className={clsx(
                  'form-control bg-transparent',
                  'input-olho',
                  {
                    'is-invalid': formik.touched.password && formik.errors.password,
                  },
                  {
                    'is-valid': formik.touched.password && !formik.errors.password,
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

      <div className="wrapper-olho">
          <div className={`${formik.touched.confirmpassword ? "icon-olho-distancia-maior" : "icon-olho"}`}>
            <IconButton
              aria-label="visualizar senha"
              onClick={handleClickShowConfirmPassword}
              onMouseDown={handleMouseDownConfirmPassword}
              edge="end"
            >
              {showConfirmPassword ?<i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
            </IconButton>
          </div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='Confirmação de senha'
            autoComplete='off'
            {...formik.getFieldProps('confirmpassword')}
            className={clsx(
              'form-control bg-transparent',
              'input-olho',
              {
                'is-invalid': formik.touched.confirmpassword && formik.errors.confirmpassword,
              },
              {
                'is-valid': formik.touched.confirmpassword && !formik.errors.confirmpassword,
              }
            )}
          />
        </div>  
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
      <div className='fv-row mb-8'>
        <label className='form-check form-check-inline' htmlFor='kt_login_toc_agree'>
          <input
            className='form-check-input'
            type='checkbox'
            id='kt_login_toc_agree'
            {...formik.getFieldProps('acceptTerms')}
          />
          <span>
            Eu aceito os
            <a href='termos' target='_blank' className='ms-1 link-primary'>
              termos
            </a>
            .
          </span>
        </label>
        {formik.touched.acceptTerms && formik.errors.acceptTerms && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.acceptTerms}</span>
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
          disabled={formik.isSubmitting || !formik.isValid || !formik.values.acceptTerms}
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
