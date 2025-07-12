const TicketTypeRequest = require("../src/pairtest/lib/TicketTypeRequest.js");

/**
 * Unit tests for the TicketTypeRequest class.
 * Ensures ticket type and quantity validation logic works as expected.
 */
describe("TicketTypeRequest", () => {

    test("should create a valid TicketTypeRequest object", () => {
        const ticket = new TicketTypeRequest("ADULT", 3);
        expect(ticket.getTicketType()).toBe("ADULT");
        expect(ticket.getNoOfTickets()).toBe(3);
    });

    test("should throw an error for invalid ticket type", () => {
        expect(() => new TicketTypeRequest("SENIOR", 2))
            .toThrow("type must be ADULT, CHILD, or INFANT");
    });

    test("should throw an error for non-integer ticket quantity", () => {
        expect(() => new TicketTypeRequest("ADULT", "two"))
            .toThrow("noOfTickets must be a positive integer");
    });

    test("should throw an error for negative ticket quantity", () => {
        expect(() => new TicketTypeRequest("ADULT", -5))
            .toThrow("noOfTickets must be a positive integer");
    });

    test("should throw an error for zero ticket quantity", () => {
        expect(() => new TicketTypeRequest("ADULT", 0))
            .toThrow("noOfTickets must be a positive integer");
    });
});
