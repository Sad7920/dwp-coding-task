const TicketService = require("../src/pairtest/TicketService.js");
const TicketTypeRequest = require("../src/pairtest/lib/TicketTypeRequest.js");

// Mocking External Services
jest.mock("../src/thirdparty/paymentgateway/TicketPaymentService.js");
jest.mock("../src/thirdparty/seatbooking/SeatReservationService.js");

const TicketPaymentService = require("../src/thirdparty/paymentgateway/TicketPaymentService.js");
const SeatReservationService = require("../src/thirdparty/seatbooking/SeatReservationService.js");

/**
 * Unit tests for the TicketService class.
 * Ensures ticket purchase functionality, validation rules, and interactions with external services.
 */
describe("TicketService", () => {
    let ticketService;
    let mockPaymentService;
    let mockReservationService;

    /**
     * Before each test:
     * - Creates new instances of mocked payment and reservation services.
     * - Mocks the required service methods (`makePayment` and `reserveSeat`).
     * - Instantiates a new `TicketService` instance and assigns the mocked services.
     * - Clears all previous mock function calls.
     */
    beforeEach(() => {
        mockPaymentService = new TicketPaymentService();
        mockReservationService = new SeatReservationService();

        mockPaymentService.makePayment = jest.fn();
        mockReservationService.reserveSeat = jest.fn();

        ticketService = new TicketService();
        ticketService.paymentService = mockPaymentService;
        ticketService.reservationService = mockReservationService;

        jest.clearAllMocks();
    });


    test("should throw an error when purchasing Child/Infant tickets without an Adult", () => {
        expect(() => ticketService.purchaseTickets(1, new TicketTypeRequest("CHILD", 2)))
            .toThrow("At least one Adult ticket is required for a valid purchase.");

        expect(() => ticketService.purchaseTickets(1, new TicketTypeRequest("INFANT", 1)))
            .toThrow("At least one Adult ticket is required for a valid purchase.");
    });

    test("should correctly process valid ticket purchases", () => {
        expect(() =>
            ticketService.purchaseTickets(
                1,
                new TicketTypeRequest("ADULT", 2),
                new TicketTypeRequest("CHILD", 1)
            )
        ).not.toThrow();

        expect(mockPaymentService.makePayment).toHaveBeenCalledWith(1, 65);
        expect(mockReservationService.reserveSeat).toHaveBeenCalledWith(1, 3);
    });

    test("should throw an error for invalid account ID", () => {
        expect(() => ticketService.purchaseTickets(0, new TicketTypeRequest("ADULT", 1)))
            .toThrow("Invalid account ID: Must be a positive integer.");
        expect(() => ticketService.purchaseTickets(-3, new TicketTypeRequest("ADULT", 1)))
            .toThrow("Invalid account ID: Must be a positive integer.");
    });

    test("should throw an error when purchasing more than 25 tickets", () => {
        expect(() => ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", 26)))
            .toThrow("Ticket limit exceeded: Cannot purchase more than 25 tickets at a time.");
    });

    test("should throw an error if total ticket count exceeds 25", () => {
        expect(() =>
            ticketService.purchaseTickets(
                1,
                new TicketTypeRequest("ADULT", 20),
                new TicketTypeRequest("CHILD", 6)
            )
        ).toThrow("Ticket limit exceeded: Cannot purchase more than 25 tickets at a time.");
    });

    test("should call payment and reservation services correctly", () => {
        ticketService.purchaseTickets(
            1,
            new TicketTypeRequest("ADULT", 3),
            new TicketTypeRequest("CHILD", 2)
        );

        expect(mockPaymentService.makePayment).toHaveBeenCalledWith(1, 105);
        expect(mockReservationService.reserveSeat).toHaveBeenCalledWith(1, 5);
    });

    test("should correctly process a purchase with infants", () => {
        ticketService.purchaseTickets(
            1,
            new TicketTypeRequest("ADULT", 2),
            new TicketTypeRequest("INFANT", 1)
        );

        expect(mockPaymentService.makePayment).toHaveBeenCalledWith(1, 50);
        expect(mockReservationService.reserveSeat).toHaveBeenCalledWith(1, 2); // No seat for infant
    });
});
