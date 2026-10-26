/* Local demo validation. No network requests, persistence or fake delivery. */
(() => {
    const localDate = new Date();
    const today = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;
    document.querySelectorAll("[data-future-date]").forEach((input) => {
        input.min = today;
    });
    document.querySelectorAll(".demo-form").forEach((form, formIndex) => {
        const controls = [...form.querySelectorAll("input,select,textarea")].filter(
            (c) => c.type !== "hidden",
        );
        function clearError(control) {
            const error = form.querySelector(`#${control.dataset.errorId}`);
            if (error) error.remove();
            control.removeAttribute("aria-invalid");
            control.removeAttribute("aria-describedby");
        }
        function errorText(control) {
            if (control.type === "checkbox" && !control.checked)
                return "Please confirm this checkbox to continue.";
            if (control.required && !control.value.trim()) return "Please complete this field.";
            if (
                control.type === "email" &&
                control.value &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(control.value)
            )
                return "Please enter a complete email address, such as name@example.com.";
            if (control.minLength > 0 && control.value.trim().length < control.minLength)
                return `Please use at least ${control.minLength} characters.`;
            if (
                control.type === "date" &&
                control.value &&
                control.min &&
                control.value < control.min
            )
                return "Please choose today or a future date.";
            if (control.validity.rangeUnderflow || control.validity.rangeOverflow)
                return `Please enter a number from ${control.min} to ${control.max}.`;
            if (control.validity.stepMismatch) return "Please enter a whole number.";
            if (control.validity.patternMismatch)
                return "Please enter a valid phone number with 7–25 characters.";
            if (!control.validity.valid) return "Please check this value and try again.";
            return "";
        }
        controls.forEach((control, i) => {
            if (!control.id) control.id = `form-${formIndex}-control-${i}`;
            control.dataset.errorId = `${control.id}-error`;
            control.addEventListener("input", () => {
                clearError(control);
                form.querySelector(".form-status").textContent = "";
            });
            control.addEventListener("change", () => clearError(control));
        });
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const status = form.querySelector(".form-status");
            status.textContent = "";
            let first;
            controls.forEach((control) => {
                clearError(control);
                const message = errorText(control);
                if (!message) return;
                const error = document.createElement("span");
                error.id = control.dataset.errorId;
                error.className = "field-error";
                error.textContent = message;
                control.setAttribute("aria-invalid", "true");
                control.setAttribute("aria-describedby", error.id);
                const holder = control.closest(".check-label") || control.closest(".field");
                if (holder.classList.contains("field")) holder.append(error);
                else {
                    error.classList.add("full");
                    holder.insertAdjacentElement("afterend", error);
                }
                first ||= control;
            });
            if (first) {
                status.textContent = "Please check the highlighted fields.";
                first.focus();
                return;
            }
            const confirmations = {
                newsletter:
                    "Demo signup validated. Your email has not been sent or saved. Connect a newsletter provider to accept real subscriptions.",
                contact:
                    "Demo enquiry validated. Your message has not been sent or saved. Connect a form service to receive real enquiries.",
                bulk: "Demo bulk enquiry validated. No order has been placed and your details have not been sent or saved.",
                event: "Demo interest validated. No seat has been reserved and your details have not been sent or saved.",
            };
            status.textContent = confirmations[form.dataset.kind];
            form.reset();
        });
    });
})();
