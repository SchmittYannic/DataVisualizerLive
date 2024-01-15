import { useMemo } from "react";
import DebouncedInput from "./DebouncedInput";

const FilterTable = ({column, table,}) => {
    const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id)

    const columnName = table.getColumn(column.id).columnDef.name;

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
                    {`filter column ${columnName} minimum`}
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
                    placeholder={`Min ${columnName} ${
                    column.getFacetedMinMaxValues()?.[0]
                        ? `(${column.getFacetedMinMaxValues()?.[0]})`
                        : ""
                    }`}
                    className="table--filter-number"
                    title={`Filter by minimum ${columnName}`}
                />
                <label htmlFor={column.id + "filterMax"} className="sr-only">
                    {`filter column ${columnName} maximum`}
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
                    placeholder={`Max ${columnName} ${
                            column.getFacetedMinMaxValues()?.[1]
                                ? `(${column.getFacetedMinMaxValues()?.[1]})`
                                : ""
                        }`}
                    className="table--filter-number"
                    title={`Filter by maximum ${columnName}`}
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
                {`filter Column ${columnName}`}
            </label>
            <DebouncedInput
                id={column.id + "filter"}
                type="text"
                value={(columnFilterValue ?? "")}
                onChange={value => column.setFilterValue(value)}
                placeholder={`Filter ${columnName} (${column.getFacetedUniqueValues().size})`}
                className={`table--filter-text ${column.id}`}
                list={column.id + "list"}
                title={`Filter column: ${columnName}`}
            />
        </>
    )
}

export default FilterTable