const TicketTypeRequest = require("./lib/TicketTypeRequest.js");
const InvalidPurchaseException = require("./lib/InvalidPurchaseException.js");
const TicketPaymentService = require("../thirdparty/paymentgateway/TicketPaymentService.js");
const SeatReservationService = require("../thirdparty/seatbooking/SeatReservationService.js");

class TicketService {
    constructor() {
        this.paymentService = new TicketPaymentService();
        this.reservationService = new SeatReservationService();
    }

    /**
     * Processes ticket purchase requests.
     * @param {number} accountId - The ID of the purchasing account.
     * @param  {...TicketTypeRequest} ticketTypeRequests - List of requested tickets.
     * @throws {InvalidPurchaseException} If the purchase request is invalid.
     */
    purchaseTickets(accountId, ...ticketTypeRequests) {
        this.#validateAccountId(accountId);
        const { totalAmount, totalSeats, hasAdult } = this.#processTicketRequests(ticketTypeRequests);

        if (!hasAdult) {
            throw new InvalidPurchaseException("At least one Adult ticket is required for a valid purchase.");
        }

        // Process payment and reserve seats
        this.paymentService.makePayment(accountId, totalAmount);
        this.reservationService.reserveSeat(accountId, totalSeats);
    }

    /**
     * Validates if the account ID is a positive integer.
     * @param {number} accountId - The account ID.
     * @throws {InvalidPurchaseException} If the account ID is invalid.
     */
    #validateAccountId(accountId) {
        if (!Number.isInteger(accountId) || accountId <= 0) {
            throw new InvalidPurchaseException("Invalid account ID: Must be a positive integer.");
        }
    }

    /**
     * Processes the ticket requests, calculating total cost and required seats.
     * @param {TicketTypeRequest[]} ticketTypeRequests - Array of ticket requests.
     * @returns {object} Total amount, total seats, and whether an Adult ticket is present.
     * @throws {InvalidPurchaseException} If business rules are violated.
     */
    #processTicketRequests(ticketTypeRequests) {
        const PRICES = { INFANT: 0, CHILD: 15, ADULT: 25 };
        let totalAmount = 0;
        let totalSeats = 0;
        let totalTickets = 0;
        let hasAdult = false;

        for (const request of ticketTypeRequests) {
            const type = request.getTicketType();
            const quantity = request.getNoOfTickets();

            if (type === "ADULT") hasAdult = true;
            totalTickets += quantity;

            if (type !== "INFANT") {
                totalSeats += quantity;
            }

            totalAmount += PRICES[type] * quantity;
        }

        if (totalTickets > 25) {
            throw new InvalidPurchaseException("Ticket limit exceeded: Cannot purchase more than 25 tickets at a time.");
        }

        return { totalAmount, totalSeats, hasAdult };
    }
}

module.exports = TicketService;
