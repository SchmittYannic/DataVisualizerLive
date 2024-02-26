const toggleHorizontalScrollbar = (bool) => {
    if (bool) {
        document.documentElement.style.setProperty("--horizontal-scrollbar-height", "16px");
    } else {
        document.documentElement.style.setProperty("--horizontal-scrollbar-height", 0);
    }
}

export default toggleHorizontalScrollbar