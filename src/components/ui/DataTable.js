import { useMemo, useState } from "react"
import { 
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table"
import { MdSwapVert, MdArrowDownward, MdArrowUpward } from "react-icons/md"
import { Accordion, DebouncedInput, FilterTable } from "./"
import FuzzyFilter from "../../utils/FuzzyFilter"
import sortColumn from "../../utils/sortColumn"
import "./DataTable.css"

const DataTable = ({ data }) => {

    const isMobile = false

    const [columnFilters, setColumnFilters] = useState([]);

    const columnNames = Object.keys(data[0]);

    document.documentElement.style.setProperty("--columnCount", columnNames.length);

    const columns = useMemo(
        () => columnNames.map((columnName) => {
            return {
                accessorFn: row => row[columnName],
                id: columnName,
                cell: info => info.getValue(),
                header: () => <span>{columnName}</span>,
                sortingFn: sortColumn,
            }
        }), [columnNames]
    );

    const table = useReactTable({
        data,
        columns,
        filterFns: {
            fuzzy: FuzzyFilter,
        },
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugTable: false,
        debugHeaders: false,
        debugColumns: false,
    });

    return (
        <>
            <Accordion head={"Filter Tabelle"}>
                <div className="table--filter-wrapper">
                    <div className="table--filter">
                        {
                            table.getHeaderGroups().map(headerGroup => headerGroup.headers.map(header => {
                                if(header.column.getCanFilter()) {
                                    return (
                                        <FilterTable key={`filter` + header.column.id} column={header.column} table={table} />
                                    )
                                } else {
                                    return <></>
                                }
                            }))
                        }
                    </div>
                    <div className="divider-2" />
                </div>
            </Accordion>

            {isMobile &&
                <>
                    <div className="divider-4" />

                    <h3>Sortieren nach Spalte</h3>

                    <div className="divider-2" />

                    <div className="table--sort-wrapper">
                        {table.getHeaderGroups().map(headerGroup => (
                            headerGroup.headers.map(header => {
                                if (header.column.getCanSort()) {
                                    const isSorted = header.column.getIsSorted();
                                    return (
                                        <div key={header.id} className="table__sort">                                     
                                            <div
                                                {...{
                                                    className: "flex",
                                                    onClick: header.column.getToggleSortingHandler(),
                                                    title: `Nach Spalte ${header.id} sortieren`,
                                                }}
                                            >                                                                                                  
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {!isSorted && (
                                                    <span className="swap-vert">
                                                        <MdSwapVert />
                                                    </span> 
                                                )}
                                                {isSorted === "desc" && (
                                                    <span className="arrow-downward">
                                                        <MdArrowDownward />
                                                    </span>
                                                )}
                                                {isSorted === "asc" && (
                                                    <span className="arrow-upward">
                                                        <MdArrowUpward />
                                                    </span>
                                                )}                                    
                                            </div>
                                        </div>
                                    )
                                } else {
                                    return <></>
                                }
                            })
                        ))}
                    </div>

                    <div className="divider-4" />
                    <div className="divider-4" />
                </>
            }

            <table className="table">
                {!isMobile &&
                    <thead className="table__thead">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="table__row">
                                {headerGroup.headers.map(header => {
                                    const isSorted = header.column.getIsSorted();
                                    return (
                                        <th key={header.id} colSpan={header.colSpan} scope="col" className="table__th table__sort">                              
                                            <div
                                                {...{
                                                    className: "flex",
                                                    onClick: header.column.getToggleSortingHandler(),
                                                    title: `Nach Spalte ${header.id} sortieren`,
                                                }}
                                            >                                                                                                  
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {!isSorted && (
                                                    <span className="swap-vert">
                                                        <MdSwapVert />
                                                    </span> 
                                                )}
                                                {isSorted === "desc" && (
                                                    <span className="arrow-downward">
                                                        <MdArrowDownward />
                                                    </span>
                                                )}
                                                {isSorted === "asc" && (
                                                    <span className="arrow-upward">
                                                        <MdArrowUpward />
                                                    </span>
                                                )}                                    
                                            </div>
                                        </th>
                                    )
                                })}
                            </tr>
                        ))}
                    </thead>
                }
                <tbody>
                    {table.getRowModel().rows.map(row => {
                        return (
                            <tr key={row.id} className="table__row">
                                {row.getVisibleCells().map(cell => {
                                    if (isMobile) {
                                        const header = cell.column.id;
                                        
                                        return (
                                            <td key={cell.id} className={`table__cell ${cell.column.id}`}>
                                                <div className="table__cell__head">
                                                    {header}:
                                                </div>
                                                <div className="table__cell__body">
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </div>
                                            </td>
                                        ) 
                                    } else {
                                        return (
                                            <td key={cell.id} className={`table__cell ${cell.column.id}`}>                                
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ) 
                                    }                                     
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <div className="divider-2" />

            <div className="table--pagination">
                <span className="table--pagination button-wrapper">
                    <button
                        className="btn"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                        title="Erste Seite"
                    >
                        {"<<"}
                    </button>
                    <button
                        className="btn"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        title="Vorherige Seite"
                    >
                        {"Vorherige"}
                    </button>
                    <button
                        className="btn"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        title="Nächste Seite"
                    >
                        {"Nächste"}
                    </button>
                    <button
                        className="btn"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                        title="Letzte Seite"
                    >
                        {">>"}
                    </button>
                </span>
                <span>
                    <div>Seite</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} von{" "}
                        {table.getPageCount()}
                    </strong>
                </span>
                <span>
                    | Seitenzahl:
                    <DebouncedInput
                        className="input__number"
                        type="number"
                        value={table.getState().pagination.pageIndex + 1}
                        onChange={value => {
                            const page = value ? Number(value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                        title="Seitenzahl"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                    title="Maximale Anzahl an Einträgen pro Seite"
                >
                    {[5, 10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Zeige {pageSize}
                        </option>
                    ))}
                </select>
                <div>{table.getPrePaginationRowModel().rows.length} Zeilen</div>
            </div>

            {/* keep for debug purposes */}
            {/* <pre>{JSON.stringify(table.getState(), null, 2)}</pre> */}
            <div className="divider-4" />
        </>
    )
}

export default DataTable