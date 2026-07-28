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
        
    }
}