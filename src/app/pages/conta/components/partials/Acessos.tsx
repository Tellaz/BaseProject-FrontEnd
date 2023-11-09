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
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { useHttpClient } from '../../../../modules/services/Bundle';
import { RequestMethod } from '../../../../modules/services/core/_enums';

interface Column {
  id: 'EnderecoIP' | 'Dispositivo' | 'Plataforma'| 'Navegador' | 'Status' | 'Data';
  label: string;
  minWidth?: number;
  align?: 'center';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'EnderecoIP', label: 'ENDEREÇO IP'},
  { id: 'Dispositivo', label: 'DISPOSITIVO'},
  {
    id: 'Plataforma',
    label: 'PLATAFORMA'
  },
  {
    id: 'Navegador',
    label: 'NAVEGADOR'
  },
  {
    id: 'Status',
    label: 'STATUS'
  },
  {
    id: 'Data',
    label: 'DATA E HORA'
  },
];

interface Data {
  EnderecoIP: string;
  Dispositivo: string;
  Plataforma: string;
  Navegador: string;
  Status: string;
  Data: string;
}

function createData(
  EnderecoIP: string,
  Dispositivo: string,
  Plataforma: string,
  Navegador: string,
  Status: string,
  Data: string,
): Data {
  return { EnderecoIP, Dispositivo, Plataforma, Navegador, Status, Data };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, onRequestSort } =
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
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {

  return (
    <Toolbar
      className='table-header'
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
    </Toolbar>
  );
}

const Acessos: React.FC = () => {
  const httpClient = useHttpClient()
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('Data');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [total, setTotal] = React.useState(0)
  const [rows, setRows] = React.useState<Data[]>([]);

  const resquestTable = (pageRq: number, orderByRq: string, orderRq: string, rowsPerPageRq: number) => {
    httpClient.request({
      method: RequestMethod.POST,
      endpoint: '/Account/ListarLogAcessoUsuario',
      data: {
        Order: orderRq,
        OrderBy: orderByRq,
        Page: pageRq,
        RowsPerPage: rowsPerPageRq
      }
    }).then((result) => {
        
        const newRows = result.payload.data.map((data: Data) => {
          return createData(data.EnderecoIP, data.Dispositivo, data.Plataforma, data.Navegador, data.Status, data.Data)
        })
        setRows([...newRows])
        setTotal(result.payload.total)
    })
  }

  React.useEffect(() => {
    resquestTable(page, orderBy, order, rowsPerPage);
  },[])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    resquestTable(page, property, isAsc ? 'desc' : 'asc', rowsPerPage);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.EnderecoIP);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    resquestTable(newPage, orderBy, order, rowsPerPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    resquestTable(page, orderBy, order, parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = rows.length;

  return (
    <div className='card mb-5 mb-xl-10'>
      <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_table_access'
        aria-expanded='true'
        aria-controls='kt_account_table_access'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Acessos</h3>
        </div>
      </div>

      <div id='kt_account_table_access' className='collapse show'>
        <form  noValidate className='form'>
          <div className='card-body border-top p-9'>
            <Box sx={{ width: '100%' }}>
              <Paper className='table-border ' sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                  <Table
                    className='table-header'
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                  >
                    <EnhancedTableHead
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={handleSelectAllClick}
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
                            <TableCell className='table-cell' align="left">{row.EnderecoIP}</TableCell>
                            <TableCell className='table-cell' align="left">{row.Dispositivo}</TableCell>
                            <TableCell className='table-cell' align="left">{row.Plataforma}</TableCell>
                            <TableCell className='table-cell' align="left">{row.Navegador}</TableCell>
                            <TableCell className='table-cell' align="left"><span className={`${row.Status ? "text-success" : "text-danger"}`}>{row.Status ? "SUCESSO" : "ERRO"} </span></TableCell>
                            <TableCell className='table-cell' align="left">{row.Data}</TableCell>
                          </TableRow>
                        );
                      })}
                      {emptyRows == 0 && (
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
  )
}

export {Acessos}
