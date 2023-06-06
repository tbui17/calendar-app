

/**
 * Error thrown when the type of ITransformedEvent is of type "unknown" and is not compatible with the function.
 */
export class EventTypeError extends TypeError {
    constructor(message: string) {
        super(message);
        this.name = "EventTypeError";
    }
}
