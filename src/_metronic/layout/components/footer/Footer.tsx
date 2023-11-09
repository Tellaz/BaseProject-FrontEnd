/* eslint-disable react/jsx-no-target-blank */
import {useEffect} from 'react'
import {ILayout, useLayout} from '../../core'
import {toAbsoluteUrl} from '../../../helpers'
import {useThemeMode} from '../../../partials'
import {ThemeModeComponent} from '../../../assets/ts/layout'

const Footer = () => {
  
  const {config} = useLayout()
  const {mode} = useThemeMode()
  const systemMode = ThemeModeComponent.getSystemMode() as 'light' | 'dark'
  const currentMode = mode === 'system' ? systemMode : mode

  useEffect(() => {
    updateDOM(config)
  }, [config])
  return (
    <>
      <div className='text-dark order-2 order-md-1'>
        <span className='text-muted fw-semibold me-1'>
          {new Date().getFullYear().toString()}&copy; Powered by
        </span>
        <a
          href='https://www.pro4tech.com.br/'
          target='_blank'
          className='text-gray-800 text-hover-primary'
        >
          <img
            alt='Logo'
            src={
              mode === 'dark'
                ? toAbsoluteUrl('/media/pro4tech/logo-p4t-branco.png')
                : toAbsoluteUrl('/media/pro4tech/logo-p4t.png')
            }
            className='w-150px'
          />
        </a>
      </div>
    </>
  )
}

const updateDOM = (config: ILayout) => {
  if (config.app?.footer?.fixed?.desktop) {
    document.body.classList.add('data-kt-app-footer-fixed', 'true')
  }

  if (config.app?.footer?.fixed?.mobile) {
    document.body.classList.add('data-kt-app-footer-fixed-mobile', 'true')
  }
}

export {Footer}
