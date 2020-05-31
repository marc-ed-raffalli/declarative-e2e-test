const codesToMessage = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  429: 'Too Many Requests',
  500: 'Internal Server Error'
};

export class ErrorHandler {

  code: number;
  message: string;

  constructor(code: keyof typeof codesToMessage, message?: string) {
    this.code = code;
    this.message = message || codesToMessage[code];
  }

  toString() {
    return `${this.code} - ${this.message}`;
  }

}
