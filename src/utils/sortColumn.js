const sortColumn = (prev, curr, columnId) => {
    if (typeof prev.original[columnId] === "string" && curr.original[columnId] === "string") {
        return sortCaseInsensitive(prev, curr, columnId)
    } else if (typeof prev.original[columnId] === "string" && curr.original[columnId] === "number") {
        return 1
    } else if (typeof prev.original[columnId] === "number" && curr.original[columnId] === "string") {
        return -1
    } else if (prev.original[columnId] > curr.original[columnId]) {
        return 1
    } else if (prev.original[columnId] < curr.original[columnId]) {
        return -1
    } else {
        return 0
    }
}

const sortCaseInsensitive = (prev, curr, columnId) => {
    if (prev.original[columnId].toLowerCase() > curr.original[columnId].toLowerCase()) {
        return 1;
    } else if (prev.original[columnId].toLowerCase() < curr.original[columnId].toLowerCase()) {
        return -1;
    } else {
        return 0;
    }
}

export default sortColumn