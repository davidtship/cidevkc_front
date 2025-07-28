import React from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender, } from '@tanstack/react-table';
import { makeData } from './makeData';
import { Stack, Form } from 'react-bootstrap';
const TableFiltering = () => {
    const columns = React.useMemo(() => [
        {
            accessorKey: 'firstName',
            header: 'First Name',
            cell: (info) => info.getValue(),
            footer: (props) => props.column.id,
        },
        {
            accessorFn: (row) => row.lastName,
            id: 'lastName',
            header: 'Last Name',
            cell: (info) => info.getValue(),
            footer: (props) => props.column.id,
        },
        {
            accessorKey: 'age',
            header: 'Age',
            footer: (props) => props.column.id,
        },
        {
            accessorKey: 'visits',
            header: 'Visits',
            footer: (props) => props.column.id,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            footer: (props) => props.column.id,
        },
        {
            accessorKey: 'progress',
            header: 'Profile Progress',
            footer: (props) => props.column.id,
        },
    ], []);
    const [data] = React.useState(() => makeData(100));
    return (<>
      <Table {...{
        data,
        columns,
    }}/>
    </>);
};
function Table({ data, columns }) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true,
    });
    return (<>
      <div className="table-responsive">
        <table className="table mb-0">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (<tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                return (<th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (<div>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanFilter() ? (<div>
                              <Filter column={header.column} table={table}/>
                            </div>) : null}
                        </div>)}
                    </th>);
            })}
              </tr>))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
            return (<tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (<td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>);
                })}
                </tr>);
        })}
          </tbody>
        </table>
      </div>
    </>);
}
function Filter({ column, table }) {
    const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
    const columnFilterValue = column.getFilterValue();
    return typeof firstValue === 'number' ? (<Stack direction="horizontal" gap={2}>
      <Form.Control size="sm" type="number" value={columnFilterValue?.[0] ?? ''} onChange={(e) => column.setFilterValue((old) => [e.target.value, old?.[1]])} placeholder={`Min`}/>
      <Form.Control size="sm" type="number" value={columnFilterValue?.[1] ?? ''} onChange={(e) => column.setFilterValue((old) => [old?.[0], e.target.value])} placeholder={`Max`}/>
    </Stack>) : (<Form.Control size="sm" type="text" value={(columnFilterValue ?? '')} onChange={(e) => column.setFilterValue(e.target.value)} placeholder={`Search...`}/>);
}
export default TableFiltering;
