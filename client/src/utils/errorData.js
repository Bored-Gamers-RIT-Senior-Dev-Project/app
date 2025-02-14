/**
 * @class ErrorData a convenience for representing the data needed for an error
 */
class ErrorData {
    /**
     * Create a new ErrorData
     * @param {string} message The user-facing message for this error
     * @param {string} [severity] The severity, or "error" if not specified.
     * Should be one of "info", "error", "warning", or "success", if provided
     */
    constructor(message, severity = "error") {
        this.message = message;
        const allowedErrors = ["info", "error", "warning", "success"];
        if (!allowedErrors.includes(severity)) {
            console.warn(`ErrorData: Unexpected severity ${severity}`);
        }
        this.severity = severity;
    }
}
