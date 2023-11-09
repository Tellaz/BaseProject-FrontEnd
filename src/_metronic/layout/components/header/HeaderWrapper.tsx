/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx'
import { Field } from 'formik'
import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import { useAuth } from '../../../../app/modules/auth'
import { useHttpClient } from '../../../../app/modules/services/Bundle'
import { RequestMethod } from '../../../../app/modules/services/core/_enums'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {useLayout} from '../../core'
import {Header} from './Header'
import { SelectEmpresas } from './header-menus/SelectEmpresas'
import {Navbar} from './Navbar'

export function HeaderWrapper() {
  const {auth, saveAuth} = useAuth()
  
  const {config, classes} = useLayout()
  if (!config.app?.header?.display) {
    return null
  }

  return (
    <div id='kt_app_header' className='app-header'>
      <div
        id='kt_app_header_container'
        className={clsx(
          'app-container flex-lg-grow-1 w-100',
          classes.headerContainer.join(' '),
          config.app?.header?.default?.containerClass
        )}
      >
        {config.app.sidebar?.display && (
          <>
            <div
              className='d-flex align-items-center d-lg-none ms-n2 me-2'
              title='Show sidebar menu'
            >
              <div
                className='btn btn-icon btn-active-color-primary w-35px h-35px me-2'
                id='kt_app_sidebar_mobile_toggle'
              >
                <KTSVG path='/media/icons/duotune/abstract/abs015.svg' className=' svg-icon-1' />
              </div>              
            </div>
          </>
        )}

        {!config.app.sidebar?.display && (
          <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15'>
            <Link to='/inicio'>
              {config.layoutType !== 'dark-header' ? (
                <img
                  alt='Logo'
                  src={toAbsoluteUrl('/media/baseproject/logos/baseproject-light.svg')}
                  className='h-20px h-lg-30px app-sidebar-logo-default'
                />
              ) : (
                <>
                  <img
                    alt='Logo'
                    src={toAbsoluteUrl('/media/baseproject/logos/baseproject-dark.svg')}
                    className='h-20px h-lg-30px app-sidebar-logo-default theme-light-show'
                  />
                  <img
                    alt='Logo'
                    src={toAbsoluteUrl('/media/baseproject/logos/baseproject-light.svg')}
                    className='h-20px h-lg-30px app-sidebar-logo-default theme-dark-show'
                  />
                </>
              )}
            </Link>
          </div>
        )}
        <div className="logo-empresa d-none d-md-flex  align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15" >
          {auth && auth.user.logoDataUrl != "" && (
            <>
              <img
                alt='Logo'
                src={auth.user.logoDataUrl}
                className='h-20px h-lg-30px app-sidebar-logo-default theme-light-show'
              />
              <img
                alt='Logo'
                src={auth.user.logoDataUrl}
                className='h-20px h-lg-30px app-sidebar-logo-default theme-dark-show'
              />
            </>
          )}
          {auth && auth.user.logoDataUrl === "" && (
            <div className='notice d-flex bg-light-primary rounded border-primary border border-dashed p-4 fs-6 fw-bold text-gray-600'>Logo de sua empresa</div>
          )}
          
        </div>
        <div
          id='kt_app_header_wrapper'
          className='d-flex align-items-stretch justify-content-end flex-lg-grow-1'
        >
          {(auth?.roles.find((x) => x === 'Administrador') !== undefined) && (
            <div className='d-flex align-items-stretch justify-content-end'>
              <SelectEmpresas />
            </div>
          )}
          {config.app.header.default?.content === 'menu' &&
            config.app.header.default.menu?.display && (
              <div
                className='app-header-menu app-header-mobile-drawer align-items-stretch'
                data-kt-drawer='true'
                data-kt-drawer-name='app-header-menu'
                data-kt-drawer-activate='{default: true, lg: false}'
                data-kt-drawer-overlay='true'
                data-kt-drawer-width='225px'
                data-kt-drawer-direction='end'
                data-kt-drawer-toggle='#kt_app_header_menu_toggle'
                data-kt-swapper='true'
                data-kt-swapper-mode="{default: 'append', lg: 'prepend'}"
                data-kt-swapper-parent="{default: '#kt_app_body', lg: '#kt_app_header_wrapper'}"
              >
                <Header />
              </div>
            )}
          <Navbar />
        </div>
      </div>
    </div>
  )
}
