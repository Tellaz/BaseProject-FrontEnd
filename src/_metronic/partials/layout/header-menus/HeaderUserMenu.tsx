/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {Link} from 'react-router-dom'
import {useAuth} from '../../../../app/modules/auth'
import {toAbsoluteUrl} from '../../../helpers'
import {useNavigate} from 'react-router-dom'

const HeaderUserMenu: FC = () => {
  const {auth, logout} = useAuth()
  const user = auth?.user
  const navigate = useNavigate()

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-350px'
      data-kt-menu='true'
    >
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>
            <img
              alt='Logo'
              src={
                user?.fotoDataUrl ? user?.fotoDataUrl : toAbsoluteUrl('/media/avatars/blank.png')
              }
            />
          </div>

          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5'>
              {user?.nome}              
            </div>
            <div>
              <span className='fw-bold text-muted text-hover-primary fs-7'>
                {user?.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='separator my-2'></div>

      <div className='menu-item px-5'>
        <Link to={'conta/perfil'} className='menu-link px-5'>
          Perfil
        </Link>
      </div>

      <div className='menu-item px-5'>
        <Link to={'conta/uploads'} className='menu-link px-5'>
          Uploads
        </Link>
      </div>

      <div className='menu-item px-5'>
        <Link to={'conta/downloads'} className='menu-link px-5'>
          Downloads
        </Link>
      </div>

      <div className='menu-item px-5'>
        <a
          onClick={() => {
            logout()
            navigate('/')
          }}
          className='menu-link text-hover-danger px-5'
        >
          Sair
        </a>
      </div>
    </div>
  )
}

export {HeaderUserMenu}
