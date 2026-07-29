// Pizza class
class Pizza {
    constructor(customerName, phone, size, crust, sauce, cheese, toppings, deliveryMethod, address, instructions) {
        this.customerName = customerName;
        this.phone = phone;
        this.size = size;
        this.crust = crust;
        this.sauce = sauce;
        this.cheese = cheese;
        this.toppings = toppings;          // array of strings
        this.deliveryMethod = deliveryMethod;
        this.address = address;            // "" if pickup
        this.instructions = instructions;  // "" if none
        this.orderNumber = Math.floor(1000 + Math.random() * 9000);
    }

    // Builds and returns a full description of the order as a string.
    // The page only ever displays text produced by this method.
    getOrderSummary() {
        const timestamp = new Date().toLocaleString();
        const divider = "----------------------------------------";
 
        const lines = [
            "      S L I C E   O F   H E A V E N",
            divider,
            `Order #${this.orderNumber}`,
            `Placed: ${timestamp}`,
            divider,
            `Customer: ${this.customerName}`,
            `Phone:    ${this.phone}`,
            divider,
            `${this.size}, ${this.crust}`,
            `Sauce:    ${this.sauce}`,
            `Cheese:   ${this.cheese}`,
            `Toppings: ${this.toppings.join(", ")}`,
            divider,
            this.deliveryMethod === "Delivery"
            ? `Delivery to:\n  ${this.address}`
            : "Pickup in-store",
        ];

        if (this.instructions.trim() !== "") {
            lines.push(divider, `Notes: ${this.instructions.trim()}`);
        }
 
    lines.push(divider, "Thanks for ordering with us!");
 
    return lines.join("\n");
    }
}

// Event Listener
document.addEventListener("DOMContentLoaded", () => {
    setupToppingExclusion();
    setupDeliveryToggle();
    setupForm();
});

// "No Toppings" cancels out the other topping choices, and vice versa
function setupToppingExclusion() {
    const noToppingsBox = document.getElementById("no-toppings");
    const toppingChoices = document.querySelectorAll(".topping-choice");
 
    noToppingsBox.addEventListener("change", () => {
        if (noToppingsBox.checked) {
            toppingChoices.forEach((box) => {
            box.checked = false;
            box.disabled = true;
        });
        } else {
            toppingChoices.forEach((box) => {
                box.disabled = false;
        });
    }
    clearError("toppings");
  });
 
  toppingChoices.forEach((box) => {
    box.addEventListener("change", () => {
        if (box.checked) {
            noToppingsBox.checked = false;
        }
        clearError("toppings");
        });
    });
}

// Address is only required (and only shown) for delivery orders
function setupDeliveryToggle() {
    const deliveryGroup = document.getElementById("delivery-group");
    const addressField = document.getElementById("address-field");
    const addressInput = document.getElementById("address");
 
    addressField.style.display = "none";
 
    deliveryGroup.addEventListener("change", () => {
        const method = getRadioValue("deliveryMethod");
        if (method === "Delivery") {
            addressField.style.display = "block";
        } else {
            addressField.style.display = "none";
            addressInput.value = "";
            clearError("address");
        }
    });
}

// Form submit

function setupForm() {
    const form = document.getElementById("pizza-form");
 
    form.addEventListener("submit", (event) => {
        event.preventDefault();
 
        if (validateForm()) {
            const pizza = buildPizzaFromForm();
            printTicket(pizza.getOrderSummary());
            form.reset();
            document.getElementById("address-field").style.display = "none";
            document.querySelectorAll(".topping-choice").forEach((box) => (box.disabled = false));
        }
    });
}

function getRadioValue(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : "";
}
 
function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(
        (el) => el.value
    );
}

// Validation
function validateForm() {
    let isValid = true;

    // Name
    const name = document.getElementById("customerName").value.trim();
    if (name.length < 2) {
        showError("customerName", "Please enter your name.");
        isValid = false;
    } else {
        clearError("customerName");
    }

    // Phone — needs 10 digits, other characters (spaces/dashes) are fine
    const phoneRaw = document.getElementById("phone").value.trim();
    const digitsOnly = phoneRaw.replace(/\D/g, "");
    if (digitsOnly.length !== 10) {
        showError("phone", "Enter a valid 10-digit phone number.");
        isValid = false;
    } else {
        clearError("phone");
    }

    // Size
    if (document.getElementById("size").value === "") {
        showError("size", "Please choose a size.");
        isValid = false;
    } else {
        clearError("size");
    }

    // Crust
    if (document.getElementById("crust").value === "") {
        showError("crust", "Please choose a crust.");
        isValid = false;
    } else {
        clearError("crust");
    }

    // Sauce
    if (document.getElementById("sauce").value === "") {
        showError("sauce", "Please choose a sauce.");
        isValid = false;
    } else {
        clearError("sauce");
    }

     // Cheese
    if (document.getElementById("cheese").value === "") {
        showError("cheese", "Please choose a cheese amount.");
        isValid = false;
    } else {
        clearError("cheese");
    }

     // Toppings — at least one, including "No Toppings" as a valid choice
    if (getCheckedValues("toppings").length === 0) {
        showError("toppings", "Pick a topping option (or No Toppings).");
        isValid = false;
    } else {
        clearError("toppings");
    }

    // Delivery method
    const deliveryMethod = getRadioValue("deliveryMethod");
    if (deliveryMethod === "") {
        showError("deliveryMethod", "Choose pickup or delivery.");
    isValid = false;
    } else {
        clearError("deliveryMethod");
    }

     // Address — required only when delivering
    const address = document.getElementById("address").value.trim();
    if (deliveryMethod === "Delivery" && address.length < 5) {
        showError("address", "Enter a delivery address.");
        isValid = false;
    } else {
        clearError("address");
    }
 
    return isValid;
}

function showError(fieldName, message) {
    const errorEl = document.getElementById(`err-${fieldName}`);
    const fieldEl = document.getElementById(fieldName) || document.getElementById(`${fieldName}-group`) || document.getElementById(`${fieldName === "toppings" ? "topping-group" : fieldName}`);
    if (errorEl) errorEl.textContent = message;
    if (fieldEl) {
        const wrapper = fieldEl.closest(".field") || fieldEl;
        wrapper.classList.add("invalid");
    }
}
 
function clearError(fieldName) {
    const errorEl = document.getElementById(`err-${fieldName}`);
    const fieldEl = document.getElementById(fieldName) || document.getElementById(`${fieldName}-group`) || document.getElementById(`${fieldName === "toppings" ? "topping-group" : fieldName}`);
    if (errorEl) errorEl.textContent = "";
    if (fieldEl) {
        const wrapper = fieldEl.closest(".field") || fieldEl;
        wrapper.classList.remove("invalid");
    }
}

function buildPizzaFromForm() {
    const customerName = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const size = getSelectedText("size");
    const crust = getSelectedText("crust");
    const sauce = getSelectedText("sauce");
    const cheese = getSelectedText("cheese");
    const toppings = getCheckedValues("toppings");
    const deliveryMethod = getRadioValue("deliveryMethod");
    const address = deliveryMethod === "Delivery" ? document.getElementById("address").value.trim() : "";
    const instructions = document.getElementById("instructions").value;
 
    return new Pizza(customerName, phone, size, crust, sauce, cheese, toppings, deliveryMethod, address, instructions);
}
 
// Reads the human-readable label of a <select>, not its raw value
function getSelectedText(selectId) {
  const select = document.getElementById(selectId);
  return select.options[select.selectedIndex].text;
}

// Output — filled only from Pizza.getOrderSummary()
function printTicket(summaryText) {
    const placeholder = document.getElementById("ticket-placeholder");
    const ticketText = document.getElementById("ticket-text");
 
    placeholder.hidden = true;
    ticketText.hidden = false;
    ticketText.textContent = summaryText;
 
    ticketText.style.animation = "none";
    void ticketText.offsetWidth; // restart the print-in animation
    ticketText.style.animation = "";
 
    document.getElementById("ticket").scrollIntoView({ behavior: "smooth", block: "nearest" });
}