// Resume buildin' error checkin'

class ResumeBuilderError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class LaTeXFileAccessError extends ResumeBuilderError {
    constructor(message = "Error accessing LaTeX file") {
        super(message);
    }
}

export class ResumeSectionNotFoundError extends ResumeBuilderError {
    constructor(message = "Resume section not found") {
        super(message);
    }
}