/* Runs in <head> to apply the saved/system theme before rendering. */
(() => {
    let saved;
    try {
        saved = localStorage.getItem("table-tale-theme");
    } catch (_) {
        /* Storage may be disabled. */
    }
    try {
        const direction = localStorage.getItem("table-tale-direction");
        if (direction === "rtl" || direction === "ltr") document.documentElement.dir = direction;
    } catch (_) {}
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme =
        saved === "dark" || saved === "light" ? saved : systemDark ? "dark" : "light";
})();
