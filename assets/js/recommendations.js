(() => {
    const form = document.querySelector("#finder-form");
    if (!form) return;
    const { products, filter, card } = window.TableTale;
    const params = new URLSearchParams(location.search);
    for (const key of ["players", "age", "category"]) {
        const select = form.elements[key];
        if ([...select.options].some((o) => o.value === params.get(key)))
            select.value = params.get(key);
    }
    function render() {
        const settings = Object.fromEntries(new FormData(form));
        const matches = filter(products, settings);
        document.querySelector("#finder-count").textContent =
            `${matches.length} game${matches.length === 1 ? "" : "s"} match your table. Recommendations use player ranges and minimum ages from our sample product data.`;
        document.querySelector("#finder-results").innerHTML = matches.length
            ? `<div class="grid grid-4 product-grid">${matches.map((p) => card(p, "finder")).join("")}</div>`
            : '<div class="empty-state"><h3>A different combination might do the trick.</h3><p>No sample games fit all these preferences. Try another category or clear a preference to explore more options.</p><button type="button" class="btn btn-outline" data-reset-finder>Reset the game finder</button></div>';
        document
            .querySelectorAll("[data-finder-players]")
            .forEach((b) =>
                b.setAttribute(
                    "aria-pressed",
                    String(b.dataset.finderPlayers === settings.players),
                ),
            );
        document
            .querySelectorAll("[data-finder-age]")
            .forEach((b) =>
                b.setAttribute("aria-pressed", String(b.dataset.finderAge === settings.age)),
            );
    }
    document.querySelectorAll("[data-finder-players]").forEach((b) =>
        b.addEventListener("click", () => {
            form.elements.players.value = b.dataset.finderPlayers;
            form.elements.players.dispatchEvent(new Event("change", { bubbles: true }));
        }),
    );
    document.querySelectorAll("[data-finder-age]").forEach((b) =>
        b.addEventListener("click", () => {
            form.elements.age.value = b.dataset.finderAge;
            form.elements.age.dispatchEvent(new Event("change", { bubbles: true }));
        }),
    );
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        render();
        document.querySelector("#finder-count").scrollIntoView({ block: "center" });
    });
    form.addEventListener("change", render);
    form.addEventListener("reset", () => setTimeout(render, 0));
    document.querySelector("#finder-results").addEventListener("click", (e) => {
        if (e.target.closest("[data-reset-finder]")) form.reset();
    });
    render();
})();
