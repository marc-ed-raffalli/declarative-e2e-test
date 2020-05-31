import {Logger} from './logger';

describe('Logger', () => {

  let logger: Logger;

  beforeEach(() => {
    logger = Logger.getLogger();

    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'debug').mockImplementation(jest.fn());
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });

  describe('setLogLevel', () => {

    it('sets default level to SILENT', () => {
      Logger.setLogLevel('TRACE');
      logger.trace('foo');
      expect(console.log).toHaveBeenCalled();

      (console.log as jest.Mock).mockReset();

      Logger.setLogLevel();
      logger.trace('foo');
      expect(console.log).not.toHaveBeenCalled();
    });

  });

  describe('getLogger', () => {

    it('returns singleton', () => {
      expect(Logger.getLogger()).toStrictEqual(Logger.getLogger());
    });

  });

  describe('log', () => {

    it('skips below given level', () => {
      Logger.setLogLevel('DEBUG');
      logger.trace('foo');
      logger.debug('bar');
      logger.error('baz');

      expect(console.log).not.toHaveBeenCalled();
      expect(console.debug).toHaveBeenCalledWith('bar');
      expect(console.error).toHaveBeenCalledWith('baz');
    });

    it('pretty print objects', () => {
      Logger.setLogLevel('TRACE');
      logger.trace('foo', {foo: 123});

      expect(console.log).toHaveBeenCalledWith('foo', expect.any(String));
      expect(JSON.parse((console.log as jest.Mock).mock.calls[0][1])).toEqual({foo: 123});
    });

    it('lowest level logs all', () => {
      Logger.setLogLevel('TRACE');
      logger.trace('foo');
      logger.debug('bar');
      logger.error('baz');

      expect(console.log).toHaveBeenCalledWith('foo');
      expect(console.debug).toHaveBeenCalledWith('bar');
      expect(console.error).toHaveBeenCalledWith('baz');
    });

  });

});
