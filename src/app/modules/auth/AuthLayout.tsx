/* eslint-disable jsx-a11y/anchor-is-valid */
import {Outlet} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../_metronic/helpers'

import './AuthLayout.css'

const AuthLayout = () => {
  
  return (
    <div className='d-flex flex-column flex-root min-vh-100 layout-background'>
      <div className='d-flex flex-column flex-column-fluid flex-lg-row justify-content-between'>
        <div className='d-flex flex-row align-items-center'>
          <div>
            <div className='d-none d-lg-flex flex-center flex-lg-start flex-column'>
              <img
                alt='Logo'
                src={toAbsoluteUrl('/media/baseproject/baseproject.svg')}
                className='w-100 h-auto'
              />
              <div className='d-flex p-15'>
                <div className='d-flex flex-column'>
                  <div className='text-black fw-bolder fs-2'>
                    <p>Inovação, Eficiência e Assertividade.</p>
                  </div>
                  <div className='text-gray-700 fw-semibold fs-4'>
                    <p>Abra as portas para uma nova era de excelência em RH. <br /> Bem-vindo(a) à plataforma inovadora e revolucionária onde a habilidade da IA se encontra e amplia a sua criatividade.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='d-flex flex-column-fluid flex-lg-row-auto justify-content-center justify-content-lg-end p-5 p-lg-20'>
          <div className='bg-body d-flex flex-column align-items-stretch flex-center rounded-4 shadow w-100 w-md-600px p-10'>
            <div className='my-3 text-center'>
              <img
                alt='Logo'
                src={toAbsoluteUrl('/media/baseproject/baseproject-dark.png')}
                className='w-100 h-auto mw-250px'
              />
            </div>
            <div className='d-flex flex-center flex-column flex-column-fluid px-lg-10 pb-15 pb-lg-20'>
              <Outlet />
            </div>
            <div className='d-flex justify-content-center flex-stack px-lg-10'>
              <div className='d-flex fw-semibold text-primary fs-base gap-5'>
                <a href='termos' target='_blank'>
                  Termos
                </a>

                <a href='/metronic8/demo1/../demo1/pages/pricing/column.html' target='_blank'>
                  Planos
                </a>

                <a href='/metronic8/demo1/../demo1/pages/contact.html' target='_blank'>
                  Contato
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className='ml-5 mr-5 px-6'></div>
      </div>
    </div>
  )
}

export {AuthLayout}
