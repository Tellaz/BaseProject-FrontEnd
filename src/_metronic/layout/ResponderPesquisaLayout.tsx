import {Outlet} from 'react-router-dom'
import {ScrollTop} from './components/scroll-top'
import {Content} from './components/content'
import {FooterWrapper} from './components/footer'

const ResponderPesquisaLayout = () => {

  return (
    <>
      <div className='d-flex flex-column flex-root app-root min-vh-100' id='kt_app_root'>
        <div className='app-page flex-column flex-column-fluid' id='kt_app_page'>
          <div className='app-wrapper flex-column flex-row-fluid ms-0' id='kt_app_wrapper'>
            <div className='app-main flex-column flex-row-fluid' id='kt_app_main'>
              <div className='d-flex flex-column flex-column-fluid'>
                <div id="kt_app_content" className="app-content flex-column-fluid pt-8">
                  <div id="kt_app_content_container" className="app-container container-fluid">
                    <Outlet />
                  </div>
                </div>
              </div>
              <FooterWrapper />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export {ResponderPesquisaLayout}
