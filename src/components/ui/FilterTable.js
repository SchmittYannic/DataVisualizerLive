import { useMemo } from "react";
import DebouncedInput from "./DebouncedInput";

const FilterTable = ({column, table,}) => {
    const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id)

    const columnFilterValue = column.getFilterValue()

    const columnFacetedUniqueValues = column.getFacetedUniqueValues()
  
    const sortedUniqueValues = useMemo(
        () =>
            typeof firstValue === "number"
            ? []
            : Array.from(columnFacetedUniqueValues.keys()).sort(),
        [columnFacetedUniqueValues, firstValue]
    );
  
    return typeof firstValue === "number" ? (
        <div>
            <div className="table--filter-number-wrapper">
                <label htmlFor={column.id + "filterMin"} className="sr-only">
                    {`Filter Spalte ${column.id} nach Minimum`}
                </label>
                <DebouncedInput
                    id={column.id + "filterMin"}
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
                    value={(columnFilterValue)?.[0] ?? ""}
                    onChange={value =>
                        column.setFilterValue((old) => [value, old?.[1]])
                    }
                    placeholder={`Min ${column.id} ${
                    column.getFacetedMinMaxValues()?.[0]
                        ? `(${column.getFacetedMinMaxValues()?.[0]})`
                        : ""
                    }`}
                    className="table--filter-number"
                    title={`Filter nach Minimum: ${column.id}`}
                />
                <label htmlFor={column.id + "filterMax"} className="sr-only">
                    {`Filter Spalte ${column.id} nach Maximum`}
                </label>
                <DebouncedInput
                    id={column.id + "filterMax"}
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
                    value={(columnFilterValue)?.[1] ?? ""}
                    onChange={value =>
                        column.setFilterValue((old) => [old?.[0], value])
                    }
                    placeholder={`Max ${column.id} ${
                            column.getFacetedMinMaxValues()?.[1]
                                ? `(${column.getFacetedMinMaxValues()?.[1]})`
                                : ""
                        }`}
                    className="table--filter-number"
                    title={`Filter nach Maximum ${column.id}`}
                />
            </div>
        </div>
    ) : (
        <>
            <datalist id={column.id + "list"}>
                {sortedUniqueValues.slice(0, 5000).map((value, idx) => (
                    <option value={value} key={String(value) + String(idx)} />
                ))}
            </datalist>
            <label htmlFor={column.id + "filter"} className="sr-only">
                {`Filter Spalte ${column.id}`}
            </label>
            <DebouncedInput
                id={column.id + "filter"}
                type="text"
                value={(columnFilterValue ?? "")}
                onChange={value => column.setFilterValue(value)}
                placeholder={`Filter ${column.id} (${column.getFacetedUniqueValues().size})`}
                className={`table--filter-text ${column.id}`}
                list={column.id + "list"}
                title={`Filter Spalte: ${column.id}`}
            />
        </>
    )
}

export default FilterTable