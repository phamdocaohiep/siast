document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("bookingForm");
    const message = document.getElementById("formMessage");
    if (!form || !message) return;

    function showError(el, msg) {
        const div = document.createElement("div");
        div.className = "error-message";
        div.textContent = msg;
        el.parentNode.insertBefore(div, el.nextSibling);
    }

    form.addEventListener("submit", function (n) {
        n.preventDefault();
        if (
            (function () {
                let valid = true;
                form.querySelectorAll("[data-validation]").forEach((field) => {
                    field.dataset.validation.split(" ").forEach((rule) => {
                        switch (rule) {
                            case "required":
                                if (!field.value.trim()) {
                                    showError(field, "This field is required");
                                    valid = false;
                                }
                                break;
                            case "email":
                                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                                    showError(field, "Please enter a valid email address");
                                    valid = false;
                                }
                                break;
                            case "date":
                                if (!/^\d{4}-\d{2}-\d{2}$/.test(field.value)) {
                                    showError(field, "Please enter a valid date (YYYY-MM-DD)");
                                    valid = false;
                                }
                                break;
                            case "time":
                                if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(field.value)) {
                                    showError(field, "Please enter a valid time (HH:MM)");
                                    valid = false;
                                }
                                break;
                        }
                    });
                });
                return valid;
            })()
        ) {
            const data = new FormData(form);
            fetch(form.action, { method: "POST", body: data })
                .then((res) => res.text())
                .then((txt) => {
                    message.innerHTML = txt;
                    if (txt.includes("Thank you for your booking")) {
                        form.reset();
                    }
                })
                .catch((err) => {
                    message.innerHTML = "An error occurred. Please try again later.";
                    console.error("Error:", err);
                });
        }
    });
});
