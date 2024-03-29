import { useMemo, useState, useCallback, useRef, useEffect } from "react"
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

import { useData, useWindowSize } from "hooks"
import { Accordion, DebouncedInput, FilterTable } from "components/ui"
import FuzzyFilter from "utils/FuzzyFilter"
import sortColumn from "utils/sortColumn"
import "./DataTable.css"

const DataTable = () => {

    const windowSize = useWindowSize();
    const isMobile = windowSize.width && windowSize.width < 850;
    const { setDataAsJSON, setIsLoading, dataAsJSON : data } = useData();

    const [filterAccordionIsOpen, setFilterAccordionIsOpen] = useState(false);
    const [sortAccordionIsOpen, setIsSortAccordionIsOpen] = useState(false);
    const [columnFilters, setColumnFilters] = useState([]);

    const columnNames = Object.keys(data[0]);

    document.documentElement.style.setProperty("--columnCount", columnNames.length);

    const columns = useMemo(
        () => columnNames.map((columnName) => {
            return {
                accessorFn: row => row[columnName],
                id: columnName,
                header: () => <span>{columnName}</span>,
                sortingFn: sortColumn,
            }
        }), [columnNames]
    );

    const defaultColumn = {
        cell: function Cell ({ getValue, row: { index }, column: { id }, table }) {
            const initialValue = getValue();
            const isNullOrUndefined = initialValue === null || initialValue === undefined;

            const [value, setValue] = useState(isNullOrUndefined ? "" : initialValue);

            const onBlur = () => {
                if (value !== initialValue) {
                    table.options.meta?.updateData(index, id, value);
                }
            };

            useEffect(() => {
                const isNullOrUndefined = initialValue === null || initialValue === undefined;
                setValue(isNullOrUndefined ? "" : initialValue);
            }, [initialValue]);

            return (
                <label >
                    <input
                        value={value}
                        onChange={e => {
                            const {value} = e.target;
                            const valueAsNumber = Number(value);
                            setValue(isNaN(valueAsNumber) ? value : valueAsNumber)
                        }}
                        onBlur={onBlur}
                        title="Wert bearbeiten"
                        tabIndex={0}
                    />
                </label>
            )
        }
    }

    const useSkipper = () => {
        const shouldSkipRef = useRef(true)
        const shouldSkip = shouldSkipRef.current

        const skip = useCallback(() => {
            shouldSkipRef.current = false
        }, [])

        useEffect(() => {
            shouldSkipRef.current = true
        })

        return [shouldSkip, skip]
    };

    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

    const pageSize = isMobile ? 1 : 10;

    const table = useReactTable({
        data,
        columns,
        defaultColumn,
        filterFns: {
            fuzzy: FuzzyFilter,
        },
        state: {
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize,
            },
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        autoResetPageIndex,
        meta: {
            updateData: (rowIndex, columnId, value) => {
                skipAutoResetPageIndex();
                const newData = data.map((row, index) => {
                    if (index === rowIndex) {
                        return {
                            ...data[rowIndex],
                            [columnId]: value,
                        }
                    }
                    return row
                })
                
                setIsLoading(true);
                setDataAsJSON(newData);
            },
        },
        debugTable: false,
        debugHeaders: false,
        debugColumns: false,
    });

    return (
        <>
            <Accordion 
                head={isMobile ? "Filter" : "Tabellenfilter"}
                isExpanded={filterAccordionIsOpen}
                onClick={() => setFilterAccordionIsOpen(!filterAccordionIsOpen)}
            >
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

            <div className="divider-2" />

            {isMobile &&
                <>
                    <Accordion
                        head={"Sortieren nach"}
                        isExpanded={sortAccordionIsOpen}
                        onClick={() => setIsSortAccordionIsOpen(!sortAccordionIsOpen)}
                    >
                        {table.getHeaderGroups().map(headerGroup => (
                            headerGroup.headers.map(header => {
                                if (header.column.getCanSort()) {
                                    const isSorted = header.column.getIsSorted();
                                    return (
                                        <div key={header.id} className="table__sort">                                     
                                            <button
                                                {...{
                                                    className: "flex",
                                                    type: "button",
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
                                                        <MdSwapVert aria-hidden="true" />
                                                    </span> 
                                                )}
                                                {isSorted === "desc" && (
                                                    <span className="arrow-downward">
                                                        <MdArrowDownward 
                                                            role="graphics-symbol"
                                                            aria-label="Absteigend sortiert" 
                                                        />
                                                    </span>
                                                )}
                                                {isSorted === "asc" && (
                                                    <span className="arrow-upward">
                                                        <MdArrowUpward 
                                                            role="graphics-symbol"
                                                            aria-label="Aufsteigend sortiert" 
                                                        />
                                                    </span>
                                                )}                                    
                                            </button>
                                        </div>
                                    )
                                } else {
                                    return <></>
                                }
                            })
                        ))}
                    </Accordion>

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
                                            <button
                                                {...{
                                                    className: "flex",
                                                    type: "button",
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
                                                        <MdSwapVert aria-hidden="true" />
                                                    </span> 
                                                )}
                                                {isSorted === "desc" && (
                                                    <span className="arrow-downward">
                                                        <MdArrowDownward 
                                                            role="graphics-symbol"
                                                            aria-label="Absteigend sortiert" 
                                                        />
                                                    </span>
                                                )}
                                                {isSorted === "asc" && (
                                                    <span className="arrow-upward">
                                                        <MdArrowUpward 
                                                            role="graphics-symbol"
                                                            aria-label="Aufsteigend sortiert" 
                                                        />
                                                    </span>
                                                )}                                    
                                            </button>
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
                        className={`btn${!table.getCanPreviousPage() ? " disabled-btn" : ""}`}
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                        title="Erste Seite"
                    >
                        {"<<"}
                    </button>
                    <button
                        className={`btn${!table.getCanPreviousPage() ? " disabled-btn" : ""}`}
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        title="Vorherige Seite"
                    >
                        {"Vorherige"}
                    </button>
                    <button
                        className={`btn${!table.getCanNextPage() ? " disabled-btn" : ""}`}
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        title="Nächste Seite"
                    >
                        {"Nächste"}
                    </button>
                    <button
                        className={`btn${!table.getCanNextPage() ? " disabled-btn" : ""}`}
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
                    | 
                    <label>
                        Seitenzahl:&nbsp;
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
                    </label>
                </span>
                <label>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                        }}
                        title="Maximale Anzahl an Einträgen pro Seite"
                    >
                        {[1, 5, 10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Zeige {pageSize}
                            </option>
                        ))}
                    </select>
                </label>            
                <div>{table.getPrePaginationRowModel().rows.length} {isMobile ? "Einträge" : "Zeilen"}</div>
            </div>

            {/* keep for debug purposes */}
            {/* <pre>{JSON.stringify(table.getState(), null, 2)}</pre> */}
            <div className="divider-4" />
        </>
    )
}

export default DataTable