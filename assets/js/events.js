/* Event content, metadata and missing-ID states are selected in main.js before
 * shared forms are initialised. Keep event integration hooks in this module. */
(() => {
    const form = document.querySelector('form[data-kind="event"]');
    if (!form) return;
    const id = new URLSearchParams(location.search).get("id") || "strategy-evening";
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "event-id";
    input.value = id;
    form.append(input);
})();
