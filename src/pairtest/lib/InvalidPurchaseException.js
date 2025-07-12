/**
 * Custom exception class for handling invalid ticket purchase requests.
 * Extends the built-in JavaScript `Error` class to provide specific error handling.
 */
class InvalidPurchaseException extends Error {
    /**
     * Creates an instance of InvalidPurchaseException.
     * @param {string} message - The error message describing the invalid purchase.
     */
    constructor(message) {
        super(message); // Calls the parent Error constructor with the provided message
        this.name = "InvalidPurchaseException"; // Sets the error name for better debugging
    }
}

module.exports = InvalidPurchaseException;
