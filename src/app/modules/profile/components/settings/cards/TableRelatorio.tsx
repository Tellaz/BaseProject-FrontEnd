/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import {visuallyHidden} from '@mui/utils'
import {RequestMethod} from '../../../../services/core/_enums'
import {useHttpClient} from '../../../../services/Bundle'

interface Column {
  id: 'NomeEmpresa' | 'NomeUsuarioMaster' | 'Contato' | 'Data' | 'TempoConcluir'
  label: string
  minWidth?: number
  align?: 'center'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  {id: 'NomeEmpresa', label: 'EMPRESA'},
  {id: 'NomeUsuarioMaster', label: 'USUÁRIO MASTER'},
  {
    id: 'Contato',
    label: 'CONTATO',
  },
  {
    id: 'Data',
    label: 'DATA',
  },
  {
    id: 'TempoConcluir',
    label: 'TEMPO PARA CONCLUIR',
  },
]

interface Data {
  IdEmpresa: number
  NomeEmpresa: string
  NomeUsuarioMaster: string
  Contato: string
  Data: string
  TempoConcluir: string
}

function createData(
  IdEmpresa: number,
  NomeEmpresa: string,
  NomeUsuarioMaster: string,
  Contato: string,
  Data: string,
  TempoConcluir: string
): Data {
  return {IdEmpresa, NomeEmpresa, NomeUsuarioMaster, Contato, Data, TempoConcluir}
}

type Order = 'asc' | 'desc'

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {order, orderBy, onRequestSort} = props
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

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
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

type PropsTableRelatorio = {
  Atividade: string
  Log: number
  DataInicio: string
  DataFim: string
  Empresas: number[]
}

const TableRelatorio: React.FC<PropsTableRelatorio> = ({
  Empresas,
  Atividade,
  Log,
  DataInicio,
  DataFim,
}) => {
  const httpClient = useHttpClient()
  const [order, setOrder] = React.useState<Order>('desc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('Data')
  const [selected] = React.useState<readonly string[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [total, setTotal] = React.useState(0)
  const [rows, setRows] = React.useState<Data[]>([])

  const resquestTable = (
    pageRq: number,
    orderByRq: string,
    orderRq: string,
    rowsPerPageRq: number
  ) => {
    httpClient
      .request({
        method: RequestMethod.POST,
        endpoint: '/Administracao/Relatorio/CarregarLog',
        data: {
          Empresas,
          Log,
          DataInicio,
          DataFim,
          Order: orderRq,
          OrderBy: orderByRq,
          Page: pageRq,
          RowsPerPage: rowsPerPageRq,
        },
      })
      .then((result) => {
        const newRows = result.payload.Itens.map((data: Data) => {
          return createData(
            data.IdEmpresa,
            data.NomeEmpresa,
            data.NomeUsuarioMaster,
            data.Contato,
            data.Data,
            data.TempoConcluir
          )
        })
        setRows([...newRows])
        setTotal(result.payload.Total)
      })
  }

  React.useEffect(() => {
    resquestTable(page, orderBy, order, rowsPerPage)
  }, [Log])

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
    resquestTable(page, property, isAsc ? 'desc' : 'asc', rowsPerPage)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    resquestTable(newPage, orderBy, order, rowsPerPage)
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    resquestTable(page, orderBy, order, parseInt(event.target.value, 10))
    setPage(0)
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = rows.length

  return (
    <div className='card mb-5 mb-xl-10 mt-10'>
      <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_table_relatorio'
        aria-expanded='true'
        aria-controls='kt_account_table_relatorio'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>{Atividade}</h3>
        </div>
      </div>

      <div id='kt_account_table_relatorio' className='collapse show'>
        <form noValidate className='form'>
          <div className='card-body border-top p-9'>
            <Paper className='table-border ' sx={{width: '100%', mb: 2}}>
              <TableContainer>
                <Table className='table-header' sx={{minWidth: 750}} aria-labelledby='tableTitle'>
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={() => {}}
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
                          sx={{cursor: 'pointer'}}
                        >
                          <TableCell className='table-cell' align='left'>
                            {row.NomeEmpresa}
                          </TableCell>
                          <TableCell className='table-cell' align='left'>
                            {row.NomeUsuarioMaster}
                          </TableCell>
                          <TableCell className='table-cell' align='left'>
                            {formatarCelular(row.Contato)}
                          </TableCell>
                          <TableCell className='table-cell' align='left'>
                            {row.Data}
                          </TableCell>
                          <TableCell className='table-cell' align='left'>
                            {row.TempoConcluir}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {emptyRows === 0 && (
                      <TableRow>
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
                labelRowsPerPage='linhas por página'
                rowsPerPageOptions={[10, 25]}
                component='div'
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </div>
        </form>
      </div>
    </div>
  )
}

const formatarCelular = (telefone: string) => {
  if (!telefone || telefone === '' || telefone === ' ') return telefone

  if (telefone.length === 10) {
    return (
      '(' +
      telefone[0] +
      telefone[1] +
      ') ' +
      telefone.substring(2, 6) +
      '-' +
      telefone.substring(6)
    )
  }

  return (
    '(' + telefone[0] + telefone[1] + ') ' + telefone.substring(2, 7) + '-' + telefone.substring(7)
  )
}

export {TableRelatorio}
