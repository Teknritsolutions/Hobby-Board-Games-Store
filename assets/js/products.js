(() => {
    const form = document.querySelector("#catalog-filters");
    if (!form) return;
    const { products, categories, filter, card } = window.TableTale;
    const params = new URLSearchParams(location.search);
    const sort = document.querySelector("#sort");
    let category = categories.includes(params.get("category")) ? params.get("category") : "";
    if (["featured", "name", "price-low", "price-high"].includes(params.get("sort")))
        sort.value = params.get("sort");
    const chips = [...document.querySelectorAll("[data-category]")];
    function render() {
        const data = new FormData(form);
        const matches = filter(products, {
            category,
            search: data.get("search").trim(),
            players: data.get("players"),
            age: data.get("age"),
        });
        if (sort.value === "name") matches.sort((a, b) => a.name.localeCompare(b.name));
        if (sort.value === "price-low") matches.sort((a, b) => a.price - b.price);
        if (sort.value === "price-high") matches.sort((a, b) => b.price - a.price);
        document.querySelector("#result-count").textContent =
            `${matches.length} game${matches.length === 1 ? "" : "s"} to discover · Sample USD prices`;
        document.querySelector("#catalog-results").innerHTML = matches.length
            ? `<div class="grid grid-4 product-grid">${matches.map((p) => card(p)).join("")}</div>`
            : '<div class="empty-state"><h3>No games on this part of the shelf.</h3><p>Try a different category, a wider age guide or another player count.</p><button type="button" class="btn btn-outline" data-reset-catalog>Clear all filters</button></div>';
        chips.forEach((c) =>
            c.dataset.category === category ? c.setAttribute("aria-current", "page") : c.removeAttribute("aria-current"),
        );
        document.querySelectorAll("#nav-products a").forEach((link) => {
            const target = new URL(link.href);
            const active = target.pathname.endsWith("/products.html") && (target.searchParams.get("category") || "") === category;
            if (active) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
        });
        const updated = new URLSearchParams();
        if (category) updated.set("category", category);
        if (sort.value !== "featured") updated.set("sort", sort.value);
        try {
            history.replaceState(
                null,
                "",
                location.pathname + (updated.size ? "?" + updated : "") + location.hash,
            );
        } catch (_) {
            /* file:// browsing still works. */
        }
    }
    function reset() {
        form.reset();
        category = "";
        sort.value = "featured";
        render();
    }

    form.addEventListener("input", render);
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        render();
    });
    form.addEventListener("reset", () => {
        category = "";
        sort.value = "featured";
        setTimeout(render, 0);
    });
    sort.addEventListener("change", render);
    document.querySelector("#catalog-results").addEventListener("click", (e) => {
        if (e.target.closest("[data-reset-catalog]")) reset();
    });
    render();
})();
