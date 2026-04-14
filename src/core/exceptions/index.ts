export class NovusActionException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NovusActionException";
  }
}

export class NovusApiException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NovusApiException";
  }
}

export class NovusConfigException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NovusConfigException";
  }
}

export class NovusUiException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NovusUiException";
  }
}
