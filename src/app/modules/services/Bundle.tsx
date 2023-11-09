import axios from 'axios'
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'
import {
  Dispatch,
  FC,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {WithChildren, toAbsoluteUrl} from '../../../_metronic/helpers'
import BlockUi from '@availity/block-ui'
import {FileModel, RequestModel, defaultRequestModel} from './core/_models'
import Dropzone from 'dropzone'
import * as CompanyEmailValidator from 'company-email-validator'
import React from 'react'
import {Tooltip as BsTooltip} from 'bootstrap'
import {useAuth} from '../auth'
import { useFormikContext } from 'formik'

const API_URL = process.env.REACT_APP_API_URL

export interface IHttpClientResponse {
  success: boolean
  payload: any
}

const useHttpClient = (baseUrl: string | undefined = API_URL) => {
  const axiosInstance = axios.create({withCredentials: baseUrl === API_URL})
  const {setBlocking} = useBlockUI()
  const navigate = useNavigate()
  const alert = useAlert()
  const {auth, logout} = useAuth()

  const _request = async (requestModel: RequestModel) => {
    requestModel = {...defaultRequestModel, ...requestModel}
    const blockFree = requestModel.blockFree
    try {
      if (!blockFree) setBlocking(true)

      return await axiosInstance
        .request({
          method: requestModel.method,
          url: `${baseUrl}${requestModel.endpoint}${queryObjectToString(requestModel.queryObject)}`,
          data: requestModel.data,
          headers: configHeaderOptions(requestModel.headers),
        })
        .then((response) => {
          if (!blockFree) setBlocking(false)
          return checkResponse(baseUrl??"" ,response, requestModel.ifSuccessRedirectTo)
        })
        .catch((error) => {
          if (!blockFree) setBlocking(false)
          return checkError(error)
        })
    } catch (error) {
      if (!blockFree) setBlocking(false)
      return checkError(error)
    }
  }

  const defaultHeaderOptions = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json; charset=utf-8',
  }

  const configHeaderOptions = (headerOptions: any) => {
    const _headerOptions: any = defaultHeaderOptions

    if (headerOptions) {
      Object.keys(headerOptions).forEach(function (key: string) {
        _headerOptions[key] = !_headerOptions[key]
          ? headerOptions[key]
          : _headerOptions[key] + ',' + headerOptions[key]
      })
    }

    return _headerOptions
  }

  const defaultHttpClientResponse: IHttpClientResponse = {
    success: false,
    payload: undefined,
  }

  const checkResponse = (baseUrl:string, response: any, ifSuccessRedirectTo?: string) => {
    let httpClientResponse = defaultHttpClientResponse

    if (response && response.data) {
      const data = response.data

      if (baseUrl !== API_URL) {
        httpClientResponse.success = true
        httpClientResponse.payload = data
        return httpClientResponse
      }

      httpClientResponse.payload = data.Payload ?? undefined

      if (data.IsRequestSuccessful) {
        httpClientResponse.success = true

        if (data.ShowSuccessMessage) {
          alert
            .createMessage({
              html: data.Message,
              icon: 'success',
            })
            .then(() => {
              if (ifSuccessRedirectTo) {
                navigate(ifSuccessRedirectTo)
              }
            })
        } else if (ifSuccessRedirectTo) {
          navigate(ifSuccessRedirectTo)
        }
      } else {
        alert.createMessage({
          html: data.ErrorMessage,
          icon: 'error',
        })
      }
    }

    return httpClientResponse
  }

  const checkError = (error: any) => {
    if (error.response) {
      console.log('Response Error:', error.response)

      if (auth && error.response.status === 401) {
        alert
          .createMessage({
            title: 'Aviso',
            html: 'Sessão expirada, por favor acesse sua conta novamente!',
            icon: 'warning',
          })
          .then(() => {
            logout()
            navigate('/login')
          })
      } else {
        alert.showDefaultRequestError()
      }
    } else if (error.request) {
      console.log('Request Error:', error.request)

      alert.showDefaultRequestError()
    } else {
      console.log('Error', error)

      alert.showDefaultRequestError()
    }

    return defaultHttpClientResponse
  }

  const queryObjectToString = (queryObject: any) => {
    return queryObject ? '?' + new URLSearchParams(queryObject).toString() : ''
  }

  return {
    request: _request,
  }
}

const useAlert = () => {
  const defaultSweetAlertOptions = {
    title: 'Aviso',
    html: '',
    icon: 'warning',
    confirmButtonText: 'OK',
    customClass: {
      confirmButton: 'btn font-weight-bold',
    },
  }

  const defaultSweetAlertCofirmationOptions = {
    title: 'Tem certeza?',
    html: 'Realmente deseja confirmar essa ação?',
    icon: 'warning',
    confirmButtonText: 'Sim',
    showCancelButton: true,
    cancelButtonText: 'Não',
    customClass: {
      confirmButton: 'btn font-weight-bold',
      cancelButton: 'btn font-weight-bold',
    },
  }

  const _createAlertMessage = (alertOptions: any) => {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: alertOptions.title || defaultSweetAlertOptions.title,
        html: alertOptions.html || defaultSweetAlertOptions.html,
        icon: alertOptions.icon || defaultSweetAlertOptions.icon,
        allowOutsideClick: false,
        confirmButtonText:
          alertOptions.confirmButtonText || defaultSweetAlertOptions.confirmButtonText,
        customClass: alertOptions.customClass || defaultSweetAlertOptions.customClass,
      }).then(() => {
        resolve('Mensagem exibida com sucesso!')
      })
    })
  }

  const _createConfirmationMessage = (alertOptions: any) => {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: alertOptions.title || defaultSweetAlertCofirmationOptions.title,
        html: alertOptions.html || defaultSweetAlertCofirmationOptions.html,
        icon: alertOptions.icon || defaultSweetAlertCofirmationOptions.icon,
        allowOutsideClick: false,

        showCancelButton: true,
        confirmButtonText:
          alertOptions.confirmButtonText || defaultSweetAlertCofirmationOptions.confirmButtonText,
        cancelButtonText:
          alertOptions.cancelButtonText || defaultSweetAlertCofirmationOptions.cancelButtonText,
        customClass: alertOptions.customClass || defaultSweetAlertCofirmationOptions.customClass,
      }).then((result) => {
        if (result.isConfirmed) {
          if (alertOptions.confirmAction) alertOptions.confirmAction()
          resolve('Mensagem exibida com sucesso!')
        }
      })
    })
  }

  const _showDefaultRequestError = () => {
    return _createAlertMessage({
      title: 'Erro',
      html: 'Erro na requisição, por favor tente novamente!',
      icon: 'error',
    })
  }

  return {
    createMessage: _createAlertMessage,
    createDialog: _createConfirmationMessage,
    showDefaultRequestError: _showDefaultRequestError,
  }
}

const useValidation = () => {
  const _CompanyEmail = (email: string) => {
    return CompanyEmailValidator.isCompanyEmail(email)
  }

  const _CPF = (cpf: string) => {
    cpf = cpf.replace(/[\s.-]*/gim, '')

    if (
      !cpf ||
      cpf.length !== 11 ||
      cpf === '00000000000' ||
      cpf === '11111111111' ||
      cpf === '22222222222' ||
      cpf === '33333333333' ||
      cpf === '44444444444' ||
      cpf === '55555555555' ||
      cpf === '66666666666' ||
      cpf === '77777777777' ||
      cpf === '88888888888' ||
      cpf === '99999999999'
    ) {
      return false
    }

    var soma = 0
    for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i)
    var resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpf.substring(9, 10))) return false
    soma = 0
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i)
    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpf.substring(10, 11))) return false

    return true
  }

  const _CNPJ = (cnpj: string) => {
    cnpj = cnpj.replace(/[^\d]+/g, '')

    if (
      !cnpj ||
      cnpj.length !== 14 ||
      cnpj === '00000000000000' ||
      cnpj === '11111111111111' ||
      cnpj === '22222222222222' ||
      cnpj === '33333333333333' ||
      cnpj === '44444444444444' ||
      cnpj === '55555555555555' ||
      cnpj === '66666666666666' ||
      cnpj === '77777777777777' ||
      cnpj === '88888888888888' ||
      cnpj === '99999999999999'
    ) {
      return false
    }

    var tamanho = cnpj.length - 2
    var numeros = cnpj.substring(0, tamanho)
    var digitos = cnpj.substring(tamanho)
    var soma = 0
    var pos = tamanho - 7
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }
    var resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== parseInt(digitos.charAt(0))) return false
    tamanho = tamanho + 1
    numeros = cnpj.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== parseInt(digitos.charAt(1))) return false

    return true
  }

  return {
    CompanyEmail: _CompanyEmail,
    CNPJ: _CNPJ,
    CPF: _CPF,
  }
}

type BlockUIContextProps = {
  blocking: boolean
  setBlocking: Dispatch<SetStateAction<boolean>>
}

const initBlockUIContextPropsState = {
  blocking: false,
  setBlocking: () => {},
}

const BlockUIContext = createContext<BlockUIContextProps>(initBlockUIContextPropsState)

const useBlockUI = () => {
  return useContext(BlockUIContext)
}

const BlockUIProvider: FC<WithChildren> = ({children}) => {
  const [blocking, setBlocking] = useState<boolean>(false)

  return (
    <BlockUIContext.Provider value={{blocking, setBlocking}}>
      <BlockUi className='h-100' blocking={blocking}>
        {children}
      </BlockUi>
    </BlockUIContext.Provider>
  )
}

interface IDropzoneOptions {
  url?: string
  paramName?: string
  acceptedFiles?: string
  maxFiles?: number
  maxFilesize?: number
  addRemoveLinks?: boolean
  dictDefaultMessage?: string
  dictFallbackMessage?: string
  dictFallbackText?: string
  dictFileTooBig?: string
  dictInvalidFileType?: string
  dictResponseError?: string
  dictCancelUpload?: string
  dictCancelUploadConfirmation?: string
  dictRemoveFile?: string
  dictMaxFilesExceeded?: string
}

const _defaultDropzoneOptions: IDropzoneOptions = {
  url: `${API_URL}/Service/FileCallback`,
  paramName: 'file',
  acceptedFiles: undefined,
  maxFiles: 10,
  maxFilesize: 10, // MB
  addRemoveLinks: true,
  dictDefaultMessage: 'Arraste e solte os arquivos ou clique aqui para procurar',
  dictFallbackMessage: "Seu navegador não suporta fazer upload de arquivos com drag'n'drop!",
  dictFallbackText:
    'Use o formulário alternativo abaixo para fazer upload de seus arquivos como antigamente.',
  dictFileTooBig:
    'O arquivo é muito grande ({{filesize}}MB)! Tamanho máximo permitido: {{maxFilesize}}MB.',
  dictInvalidFileType: 'Tipo de arquivo inválido!',
  dictResponseError: 'Servidor respondeu com código {{statusCode}}!',
  dictCancelUpload: 'Cancelar',
  dictCancelUploadConfirmation: 'Tem certeza de que deseja cancelar este upload?',
  dictRemoveFile: 'Remover',
  dictMaxFilesExceeded: 'Não é possível carregar mais arquivos!',
}

interface IDropzoneComponent {
  filesHandler: Function
  id: string
  options?: IDropzoneOptions
  aditionalClass?: string
  preloadFiles?: any
  blockClick?: boolean
}

const DropzoneComponent: FC<IDropzoneComponent> = ({
  filesHandler,
  id,
  options = _defaultDropzoneOptions,
  aditionalClass = '',
  preloadFiles = null,
  blockClick = false,
}) => {
  options = {..._defaultDropzoneOptions, ...options}
  options.addRemoveLinks = !blockClick
  Dropzone.autoDiscover = false
  let [myDropzone, setMyDropzone] = useState<Dropzone>()
  const {setBlocking} = useBlockUI()
  const alert = useAlert()
  const helper = useHelper()

  useEffect(() => {
    if (!myDropzone) {
      let dropzone = new Dropzone(`#${id}`, options)

      dropzone.on('complete', async (file) => {
        file.previewElement.addEventListener('click', () => {
          alert.createDialog({
            title: 'Tem certeza?',
            html: 'Realmente deseja baixar esse arquivo?',
            confirmAction: async () => {
              setBlocking(true)

              let url = window.URL.createObjectURL(await helper.createBlob(file))
              let a = document.createElement('a')
              a.href = url
              document.body.appendChild(a)
              a.download = file.name
              a.click()
              a.remove()

              setBlocking(false)
            },
          })
        })

        await filesHandler(dropzone.files.filter((f) => f.accepted))
      })

      dropzone.on('removedfile', async (file) => {
        await filesHandler(dropzone.files.filter((f) => f.accepted && f !== file))
      })

      dropzone.on('error', (file, message) => {
        dropzone.removeFile(file)
        alert.createMessage({
          html: message,
        })
      })

      setMyDropzone(dropzone)
    }
  }, [])

  useEffect(() => {
    if (myDropzone && myDropzone.files.length === 0) {
      if (preloadFiles) {
        if (!Array.isArray(preloadFiles)) preloadFiles = [preloadFiles]

        for (var i = 0; i < preloadFiles.length; i++) {
          var mockFile: any = {
            accepted: true,
            name: preloadFiles[i].Nome,
            size: preloadFiles[i].Tamanho,
            type: preloadFiles[i].Tipo,
            dataURL: 'data:' + preloadFiles[i].Tipo + ';base64,' + preloadFiles[i].Base64,
          }

          myDropzone.files.push(mockFile)

          myDropzone.emit('addedfile', mockFile)
          if (mockFile.type.includes('image/'))
            myDropzone.emit('thumbnail', mockFile, mockFile.dataURL)
          else myDropzone.emit('thumbnail', mockFile, toAbsoluteUrl('/media/img/file.png'))
          myDropzone.emit('complete', mockFile)
        }
      }
    }
  }, [preloadFiles])

  useEffect(() => {
    if (myDropzone) {
      if (blockClick) {
        myDropzone.options.addRemoveLinks = false
        myDropzone.disable()
      }
    }
  }, [blockClick])

  return (
    <>
      <div className={`dropzone ${aditionalClass}`} id={id}>
        <div className='dz-message needsclick'>
          <i className='bi bi-file-earmark-arrow-up text-primary fs-3x'></i>

          <div className='ms-4'>
            <h3 className='fs-5 fw-bold text-gray-900 mb-1'>{options.dictDefaultMessage}</h3>
            <span className='fs-7 fw-semibold text-gray-400'>{`Tamanho máximo ${options.maxFilesize}MB`}</span>
          </div>
        </div>
      </div>
    </>
  )
}

const useHelper = () => {
  const _convertFileToBase64 = async (file: any) => {
    var result_base64 = ''
    var dataURL = file.dataURL
    if (dataURL && !dataURL.includes('file.png')) {
      dataURL = dataURL.replace(' ', '')
      result_base64 = dataURL.split(',')[1]
      return result_base64
    }

    result_base64 = await new Promise(async (resolve) => {
      let fileReader = new FileReader()
      fileReader.onload = function (e: any) {
        var arrayBuffer = e.target.result,
          array = new Uint8Array(arrayBuffer),
          base64String = btoa(_uint8ToString(array))
        resolve(base64String)
      }
      fileReader.readAsArrayBuffer(file)
    })

    return result_base64
  }

  const _createBlob = async (file: any) => {
    var str = await _convertFileToBase64(file)
    var s = window.atob(str)
    var bytes = new Uint8Array(s.length)

    for (var i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i)

    return new Blob([bytes], {type: file.type})
  }

  const _createBlobFromFileModel = async (file: FileModel) => {
    const s = window.atob(file.Base64)
    const bytes = new Uint8Array(s.length)
    for (var i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i)
    return new Blob([bytes], {type: file.Tipo})
  }

  const _uint8ToString = (u8a: any) => {
    var CHUNK_SZ = 0x8000
    var c = []
    for (var i = 0; i < u8a.length; i += CHUNK_SZ)
      c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)))
    return c.join('')
  }

  const _downloadFile = async (file: FileModel) => {    
    let url = window.URL.createObjectURL(await _createBlobFromFileModel(file))
    let a = document.createElement('a')
    a.href = url
    document.body.appendChild(a)
    a.download = file.Nome
    a.click()
    a.remove()
  }

  return {
    convertFileToBase64: _convertFileToBase64,
    createBlob: _createBlob,
    createBlobFromFileModel: _createBlobFromFileModel,
    downloadFile: _downloadFile
  }
}

interface TooltipModel {
  children: JSX.Element
  title: string
  placement?: 'top' | 'auto' | 'bottom' | 'left' | 'right' | (() => void) | undefined
  trigger?:
    | 'hover'
    | 'click'
    | 'focus'
    | 'manual'
    | 'click hover'
    | 'click focus'
    | 'hover focus'
    | 'click hover focus'
    | undefined
}

const Tooltip: FC<TooltipModel> = ({children, title, placement, trigger}) => {
  const childRef = useRef(undefined as unknown as Element)

  useEffect(() => {
    const t = new BsTooltip(childRef.current, {
      title: title,
      placement: placement ?? 'top',
      trigger: trigger ?? 'hover',
      html: true,
    })
    return () => t.dispose()
  }, [title])

  return React.cloneElement(children, {ref: childRef})
}

const ScrollToError: FC = () => {
  const formik = useFormikContext()
  const submitting = formik.isSubmitting

  useEffect(() => {
    if (submitting) return

    const formikErrorMessageElements = document.querySelectorAll('.formik-error-message')

    const formikErrorMessageElementsWithError = Array.from(formikErrorMessageElements).filter(e => e.innerHTML).sort((e) => {
      const order = e.getAttribute('data-order') ?? '0'
      return parseInt(order)
    })

    const firstElementWithError = formikErrorMessageElementsWithError.find(e => e.innerHTML)

    if(firstElementWithError) firstElementWithError.scrollIntoView({block: "center", behavior: "smooth"})
  }, [submitting])

  return <></>
}

export {
  useHttpClient,
  useAlert,
  useValidation,
  useBlockUI,
  BlockUIProvider,
  DropzoneComponent,
  useHelper,
  Tooltip,
  ScrollToError
}
