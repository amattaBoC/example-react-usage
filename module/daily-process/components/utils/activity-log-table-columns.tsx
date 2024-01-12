import { GridCellParams, GridColDef } from '@mui/x-data-grid';

export const activityLogColumns = (): GridColDef[] => [
  {
    field: 'settle',
    headerName: 'Settle Group',
    sortable: false,
    flex: 1.5,
    renderCell: (params: GridCellParams) => {
      const settle = params.getValue(params.id, 'settle') as string | undefined;
      return settle !== 'less: Excess FDIC Balances' ? (
        <span>{settle}</span>
      ) : (
        <span>&nbsp;&nbsp;&nbsp;{settle}</span>
      );
    },
  },
  {
    field: 'amount',
    headerName: 'Amount',
    sortable: false,
    flex: 1,
  },
  {
    field: 'accounts',
    headerName: 'Accounts',
    sortable: false,
    flex: 1,
  },
];