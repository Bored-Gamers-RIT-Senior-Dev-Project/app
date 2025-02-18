/**
 * An enum for Severity
 */
export const Severity = Object.freeze({
    INFO: "info",
    ERROR: "error",
    WARNING: "warning",
    SUCCESS: "success",
});

/**
 * @class MessageData a convenience for representing the data needed for a message
 */
export class MessageData {
    /**
     * Create a new MessageData
     * @param {string | undefined} title The title of this message
     * @param {string} message The user-facing message for this message
     * @param {string} [severity] The Severity
     * @param {object} [more] Add more arbitrary keys to this object
     */
    constructor(title, message, severity, more = undefined) {
        this.title = title;
        this.message = message;
        this.severity = severity;
        if (more) {
            Object.assign(this, more);
        }
    }
}

/**
 * @class ErrorData a convenience for representing the data needed for an error
 */
export class ErrorData {
    /**
     * Create a new ErrorData
     * @param {string} message The user-facing message for this error
     * @param {string} [string] The Severity, or Severity.ERROR if not specified.
     * @param {more} [more] Add more arbitrary keys to this object
     */
    constructor(message, severity = Severity.ERROR, more = undefined) {
        const messageData = new MessageData(undefined, message, severity, more);
        Object.assign(this, messageData);
    }
}
