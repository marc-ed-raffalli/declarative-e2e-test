type logLevelType = 'SILENT' | 'ERROR' | 'DEBUG' | 'TRACE';

const
  logPriorityByLevel: { [k in logLevelType]: number } = {
    'TRACE': 1,
    'DEBUG': 2,
    'ERROR': 3,
    'SILENT': 4
  };

export class Logger {

  static loggerInstance: Logger;

  private constructor(private level: logLevelType = 'SILENT') {
  }

  static getLogger() {
    if (!this.loggerInstance) {
      this.loggerInstance = new Logger();
    }
    return this.loggerInstance;
  }

  static setLogLevel(level: logLevelType = 'SILENT') {
    this.getLogger().level = level;
  }

  public trace(...messages: any[]) {
    this.log('TRACE', ...messages);
  }

  public debug(...messages: any[]) {
    this.log('DEBUG', ...messages);
  }

  public error(...messages: any[]) {
    this.log('ERROR', ...messages);
  }

  private log(callLevel: logLevelType, ...messages: any[]) {
    if (logPriorityByLevel[callLevel] < logPriorityByLevel[this.level]) {
      return;
    }

    // pretty print for non primitive
    messages = messages.map(m =>
      m && typeof m === 'object'
        ? JSON.stringify(m, undefined, '  ')
        : m
    );

    switch (callLevel) {
      case 'TRACE':
        // tslint:disable-next-line:no-console
        return console.log.call(console, ...messages);
      case 'DEBUG':
        // tslint:disable-next-line:no-console
        return console.debug.call(console, ...messages);
      case 'ERROR':
        // tslint:disable-next-line:no-console
        return console.error.call(console, ...messages);
    }
  }

}
