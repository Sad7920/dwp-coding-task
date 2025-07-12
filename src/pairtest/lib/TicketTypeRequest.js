/**
 * List of valid ticket types.
 * Ensures only predefined ticket types can be used.
 * @constant {string[]}
 */
const VALID_TYPES = ['ADULT', 'CHILD', 'INFANT'];

/**
 * Represents a request for a specific type and quantity of tickets.
 * Ensures validity of ticket type and quantity before creating an instance.
 */
class TicketTypeRequest {
    /** @type {string} Private field storing the ticket type */
    #type;

    /** @type {number} Private field storing the number of tickets requested */
    #noOfTickets;

    /**
     * Creates an instance of TicketTypeRequest.
     * @param {string} type - The type of ticket (must be 'ADULT', 'CHILD', or 'INFANT').
     * @param {number} noOfTickets - The number of tickets requested (must be a positive integer).
     * @throws {TypeError} If an invalid ticket type or quantity is provided.
     */
    constructor(type, noOfTickets) {
        if (!VALID_TYPES.includes(type)) {
            throw new TypeError(`type must be ${VALID_TYPES.slice(0, -1).join(', ')}, or ${VALID_TYPES.slice(-1)}`);
        }

        if (!Number.isInteger(noOfTickets) || noOfTickets <= 0) {
            throw new TypeError('noOfTickets must be a positive integer');
        }

        this.#type = type;
        this.#noOfTickets = noOfTickets;
    }

    /**
     * Returns the number of tickets requested.
     * @returns {number} The number of tickets.
     */
    getNoOfTickets() {
        return this.#noOfTickets;
    }

    /**
     * Returns the type of ticket requested.
     * @returns {string} The ticket type ('ADULT', 'CHILD', or 'INFANT').
     */
    getTicketType() {
        return this.#type;
    }
}

module.exports = TicketTypeRequest;
