import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { IconButton } from '@mui/material';
import { useAlert, useHelper, useHttpClient } from '../../../../modules/services/Bundle';
import { EnumDownloadTipo, EnumTaskStatus, EnumUploadTipo, RequestMethod } from '../../../../modules/services/core/_enums';
import { FileModel } from '../../../../modules/services/core/_models';

interface Data {
  Id: number;
  IdUsuario: number;
  MD5: string;
  Tipo: number;
  TipoString: string;
  Status: number;
  StatusString: string;
  StatusColor: string;
  DataInicial: Date;
  DataInicialString: string;
  DataFinal: Date;
  DataFinalString: string;
}

interface Column {
  id: keyof Data;
  label: string;
  minWidth?: number;
  align?: 'center';
  format?: (value: number) => string;
}

interface Filtros {
  Tipo?: number,
  Status?: number,
}

const columns: readonly Column[] = [
  {
    id: 'TipoString',
    label: 'TIPO'
  },
  {
    id: 'StatusString',
    label: 'STATUS'
  },
  {
    id: 'DataInicialString',
    label: 'DATA INICIAL'
  },
  {
    id: 'DataFinalString',
    label: 'DATA FINAL'
  }
];

function createData(
  Id: number,
  IdUsuario: number,
  MD5: string,
  Tipo: number,
  TipoString: string,
  Status: number,
  StatusString: string,
  StatusColor: string,
  DataInicial: Date,
  DataInicialString: string,
  DataFinal: Date,
  DataFinalString: string,
): Data {
  return {Id, IdUsuario, MD5, Tipo, TipoString, Status, StatusString, StatusColor, DataInicial, DataInicialString, DataFinal, DataFinalString};
}

type Order = 'asc' | 'desc';

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow className='table-header'>
        {columns.map((columns) => (
          <TableCell
            className='table-cell'
            key={columns.id}
            align={columns.align ? 'right' : 'left'}
          >
            <TableSortLabel
              className='fw-bolder'
              active={orderBy === columns.id}
              direction={orderBy === columns.id ? order : 'asc'}
              onClick={createSortHandler(columns.id)}
            >
              {columns.label}
              {orderBy === columns.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}        
        <TableCell
          className='table-cell fw-bolder'
          align='center'
        >
          AÇÕES
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

interface UploadDownloadProps {
  isUpload: boolean,
}

const UploadDownload: React.FC<UploadDownloadProps> = ({isUpload}) => {
  const httpClient = useHttpClient()
  const [order, setOrder] = React.useState<Order>('desc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('DataInicialString')
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [total, setTotal] = React.useState(0)
  const [rows, setRows] = React.useState<Data[]>([])
  const [filtros, setFiltros] = React.useState<Filtros>({
    Tipo: undefined,
    Status: undefined
  })
  const alert = useAlert()
  const helper = useHelper()

  const resquestTable = (pageRq: number, orderByRq: string, orderRq: string, rowsPerPageRq: number, Filtros: Filtros) => {
    httpClient.request({
      method: RequestMethod.POST,
      endpoint: isUpload ? '/Account/ListarUploads' : '/Account/ListarDownloads',
      data: {
        Order: orderRq,
        OrderBy: orderByRq,
        Page: pageRq,
        RowsPerPage: rowsPerPageRq,
        Filters: Filtros
      }
    }).then((result) => {
        
      const newRows = result.payload.data.map((data: Data) => {
        return createData(data.Id, data.IdUsuario, data.MD5, data.Tipo, data.TipoString, data.Status, data.StatusString, data.StatusColor, data.DataInicial, data.DataInicialString, data.DataFinal, data.DataFinalString)
      })
      setRows([...newRows])
      setTotal(result.payload.total)
    })
  }

  React.useEffect(() => {
    obterDadosTabela()
  }, [])

  const obterDadosTabela = () => {
    resquestTable(page, orderBy, order, rowsPerPage, filtros);
  }

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    resquestTable(page, property, isAsc ? 'desc' : 'asc', rowsPerPage, filtros);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    resquestTable(newPage, orderBy, order, rowsPerPage, filtros);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    resquestTable(page, orderBy, order, parseInt(event.target.value, 10), filtros);
    setPage(0);
  };

  const emptyRows = rows.length

  return (
    <>
    <div className='card mb-5 mb-xl-10'>

      <div className='card-header'>
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>{isUpload ? 'Uploads' : 'Downloads'}</h3>
        </div>
        <div className='card-toolbar'>
          <button
              type='button'
              className='btn btn-light-primary'
              onClick={() => { 
                obterDadosTabela()
              }}
            >
              <i className="fs-2 fas fa-sync-alt"></i>
              Atualizar
            </button>  
        </div>
      </div>
      <div className='card-body p-9'>
        <div className='d-flex justify-content-end mb-2'>
          <>
            {/* begin::Filter Button */}
            <button
              type='button'
              className='btn btn-light-primary'
              data-kt-menu-trigger='click'
              data-kt-menu-placement='bottom-end'
            >
              <i className="fs-2 fas fa-arrow-down-wide-short"></i>
              Filtros
            </button>
            {/* end::Filter Button */}
            {/* begin::SubMenu */}
            <div className='menu menu-sub menu-sub-dropdown w-300px w-md-325px' data-kt-menu='true'>
              {/* begin::Header */}
              <div className='px-7 py-5'>
                <div className='fs-5 text-dark fw-bolder'>Opções</div>
              </div>
              {/* end::Header */}

              {/* begin::Separator */}
              <div className='separator border-gray-200'></div>
              {/* end::Separator */}

              {/* begin::Content */}
              <div className='px-7 py-5' data-kt-user-table-filter='form'>

                {/* begin::Input group */}
                <div className='mb-10'>
                  <label className='form-label fs-6 fw-bold'>Tipo:</label>
                  <select
                    className='form-select form-select-solid fw-bolder'
                    data-kt-select2='true'
                    data-placeholder='Select option'
                    data-allow-clear='true'
                    data-kt-user-table-filter='role'
                    data-hide-search='true'
                    onChange={e => {
                      let newFiltros = filtros
                      newFiltros.Tipo = e.target.value ? parseInt(e.target.value) : undefined
                      setFiltros(newFiltros)
                    }}
                  >
                    <option value=''>Selecione...</option>
                    {Object.keys(isUpload ? EnumUploadTipo : EnumDownloadTipo).map(key => (
                      
                      parseFloat(key) > 0 && (
                        <option key={key} value={key}>
                          {(isUpload ? EnumUploadTipo : EnumDownloadTipo)[parseFloat(key)]}
                        </option>
                      )
                      
                    ))}
                  </select>
                </div>
                {/* end::Input group */}

                {/* begin::Input group */}
                <div className='mb-10'>
                  <label className='form-label fs-6 fw-bold'>Status:</label>
                  <select
                    className='form-select form-select-solid fw-bolder'
                    data-kt-select2='true'
                    data-placeholder='Select option'
                    data-allow-clear='true'
                    data-kt-user-table-filter='role'
                    data-hide-search='true'
                    onChange={e => {
                      let newFiltros = filtros
                      newFiltros.Status = e.target.value ? parseInt(e.target.value) : undefined
                      setFiltros(newFiltros)
                    }}
                  >
                    <option value=''>Selecione...</option>
                    {Object.keys(EnumTaskStatus).map(key => (
                      
                      parseFloat(key) > 0 && (
                        <option key={key} value={key}>
                          {EnumTaskStatus[parseFloat(key)]}
                        </option>
                      )
                      
                    ))}
                  </select>
                </div>
                {/* end::Input group */}

                {/* begin::Actions */}
                <div className='d-flex justify-content-end'>
                  <button
                    type='button'
                    className='btn btn-light btn-active-light-primary fw-bold me-5 px-6'
                    data-kt-menu-dismiss='true'
                    data-kt-user-table-filter='reset'
                  >
                    Cancelar
                  </button>
                  <button
                    type='button'
                    className='btn btn-primary fw-bold px-6'
                    data-kt-menu-dismiss='true'
                    data-kt-user-table-filter='filter'
                    onClick={() => obterDadosTabela()}
                  >
                    Buscar
                  </button>
                </div>
                {/* end::Actions */}
              </div>
              {/* end::Content */}
            </div>
            {/* end::SubMenu */}
          </>
        </div>
        <form  noValidate className='form'>
          <div>
            <Box sx={{ width: '100%' }}>
              <Paper className='table-border ' sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                  <Table
                    className='table-header'
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                  >
                    <EnhancedTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                      {rows.map((row, index) => {
                        return (
                          <TableRow
                            className='table-row'
                            hover
                            tabIndex={-1}
                            key={index}
                            sx={{ cursor: 'pointer' }}
                          >
                            <TableCell className='table-cell' align="left">{row.TipoString}</TableCell>
                            <TableCell className='table-cell' align="left">
                              <span
                                className={`badge badge-light-${row.StatusColor} fw-bolder fs-8 px-2 py-1 ms-2`}
                              >
                                {row.StatusString}
                              </span>
                            </TableCell>
                            <TableCell className='table-cell' align="left">{row.DataInicialString}</TableCell>
                            <TableCell className='table-cell' align="left">{row.DataFinalString}</TableCell>
                            <TableCell className='table-cell' align="center">  
                              <IconButton 
                                className={`text-gray-800`}
                                title={isUpload ? 'Baixar arquivo de log' : 'Baixar arquivo'}
                                onClick={() => {
                                    alert.createDialog({
                                        html: isUpload ? `Realmente deseja baixar o arquivo de log gerado nesse processo de upload?` : `Realmente deseja baixar o arquivo gerado por esse processo de download?`,
                                        confirmAction: async () => {                                      
                                            const response = await httpClient.request({
                                              method: RequestMethod.GET,
                                              endpoint: isUpload ? '/Account/BaixarUploadArquivo' : '/Account/BaixarDownloadArquivo',
                                              queryObject: {
                                                id: row.Id
                                              }
                                            })

                                            if (response.success && response.payload) {
                                              const file: FileModel = response.payload
                                              await helper.downloadFile(file)
                                            }
                                        }
                                    })
                                }}
                                disabled={(isUpload ? (row.Status !== EnumTaskStatus.Incompleto && row.Status !== EnumTaskStatus.Erro) : (row.Status !== EnumTaskStatus.Completo))}
                              >
                                <i className={`fs-2 fas fa-download ${(isUpload ? (row.Status !== EnumTaskStatus.Incompleto && row.Status !== EnumTaskStatus.Erro) : (row.Status !== EnumTaskStatus.Completo)) ? 'text-gray-200' : 'text-primary'}`}></i>
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {emptyRows === 0 && (
                        <TableRow
                        >
                          <TableCell className='table-cell text-center' colSpan={6}>
                            Nenhum registro encontrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  className='table-footer'
                  labelRowsPerPage="linhas por página"
                  rowsPerPageOptions={[10, 25]}
                  component="div"
                  count={total}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Box>
          </div>
        </form>
      </div>
    </div>    
    </>
  )
}

export {UploadDownload}
