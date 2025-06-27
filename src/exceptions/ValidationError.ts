import { ValidationErrorItem } from "joi";


export default class ValidationError extends Error {
    errors: ValidationErrorItem[] = [];
    constructor(errors: ValidationErrorItem[], message?: string) {
        super(message);
        this.errors = errors;
    }
}