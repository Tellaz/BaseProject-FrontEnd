/* eslint-disable react/jsx-no-target-blank */
import {SidebarMenuItem} from './SidebarMenuItem'
import {useAuth} from '../../../../../app/modules/auth'

const SidebarMenuMain = () => {
  const {auth} = useAuth()
  
  return (
    <>
      <SidebarMenuItem
        to='/inicio'
        icon='/media/icons/duotune/general/gen001.svg'
        title='Início'
        fontIcon='bi-app-indicator'
      />

      {auth?.roles.find((x) => x === 'Administrador') !== undefined && (
        <>
          <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>
                ADMINISTRAÇÃO
              </span>
            </div>
          </div>

          <SidebarMenuItem to='/administracao/empresas' title='Empresas' hasBullet={true} />
        </>
      )}
    </>
  )
}

export {SidebarMenuMain}
