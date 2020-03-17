import * as yargs from 'yargs';
import * as xiberia from './index';

// "index" tests assets
//

function DefaultAeYargsCommandCallback (yin: yargs.Argv,
  commandName: string,
  commandDef: xiberia.PlainObject): yargs.Argv {
  return yin;
}

function DefaultAeYargsOptionCallback (yin: yargs.Argv,
  optionName: string,
  optionDef: xiberia.PlainObject,
  positional: boolean): yargs.Argv {
  return yin;
}

function AeYargsOptionHandler (yin: yargs.Argv, optionName: string,
  optionDef: xiberia.PlainObject,
  positional: boolean,
  adaptedCommand: xiberia.PlainObject,
  callback: xiberia.IDefaultAeYargsOptionCallback): yargs.Argv {
  return yin;
}

function AeYargsBeforeCommandHandler (yin: yargs.Argv, commandDescription: string, helpDescription: string,
  adaptedCommand: xiberia.PlainObject): yargs.Argv {
  return yin;
}

function AeYargsAfterCommandHandler (yin: yargs.Argv): yargs.Argv {
  return yin;
}

function YargsFailHandler (msg: string, err: Error, inst: yargs.Argv, command: any): yargs.Argv {
  return inst;
}

function handlersClientAsFn (handlers: xiberia.IAeYargsInternalBuildHandlers): void {
  const yin = require('yargs');
  handlers.onOption(yin, 'widget', { one: 1 }, true, { adapted: 1 }, DefaultAeYargsOptionCallback);
  handlers.onBeforeCommand(yin, 'widget description', 'help description', { adapted: 1 });
  handlers.onAfterCommand(yin);
  handlers.onFail('error message', new Error('an error'), yin, { one: 1 });
}

class HandlersClientAsClass {
  constructor (private handlers: xiberia.IAeYargsInternalBuildHandlers) { }
  public invoke (): void {
    const yin = require('yargs');
    this.handlers.onOption(yin, 'widget', { one: 1 }, true, { adapted: 1 }, DefaultAeYargsOptionCallback);
    this.handlers.onBeforeCommand(yin, 'widget description', 'help description', { adapted: 1 });
    this.handlers.onAfterCommand(yin);
    this.handlers.onFail('error message', new Error('an error'), yin, { one: 1 });
  }
}

describe('index', () => {
  context('IDefaultAeYargsOptionCallback', () => {
    it('can be invoked', () => {
      const fn: xiberia.IDefaultAeYargsOptionCallback = DefaultAeYargsOptionCallback;
      const yin = require('yargs');
      fn(yin, 'widget', { one: 1 }, true);
    });
  });

  context('IAeYargsOptionHandler', () => {
    it('can be invoked', () => {
      const fn: xiberia.IAeYargsOptionHandler = AeYargsOptionHandler;
      const yin = require('yargs');
      fn(yin, 'widget', { one: 1 }, true, { adapted: 1 }, DefaultAeYargsOptionCallback);
    });
  });

  context('IAeYargsBeforeCommandHandler', () => {
    it('can be invoked', () => {
      const fn: xiberia.IAeYargsBeforeCommandHandler = AeYargsBeforeCommandHandler;
      const yin = require('yargs');
      fn(yin, 'widget description', 'help description', { adapted: 1 });
    });
  });

  context('IAeYargsAfterCommandHandler', () => {
    it('can be invoked', () => {
      const fn: xiberia.IAeYargsAfterCommandHandler = AeYargsAfterCommandHandler;
      const yin = require('yargs');
      fn(yin);
    });
  });

  context('IDefaultAeYargsCommandCallback', () => {
    it('can be invoked', () => {
      const fn: xiberia.IDefaultAeYargsCommandCallback = DefaultAeYargsCommandCallback;
      const yin = require('yargs');
      fn(yin, 'get', { one: 1 });
    });
  });

  context('IYargsFailHandler', () => {
    it('can be invoked', () => {
      const fn: xiberia.IYargsFailHandler = YargsFailHandler;
      const yin = require('yargs');
      fn('error message', new Error('an error'), yin, { one: 1 });
    });
  });

  context('IAeYargsInternalBuildHandlers as function', () => {
    it('can be invoked', () => {
      const handlers = {
        onOption: AeYargsOptionHandler,
        onBeforeCommand: AeYargsBeforeCommandHandler,
        onAfterCommand: AeYargsAfterCommandHandler,
        onFail: YargsFailHandler
      };

      handlersClientAsFn(handlers);
    });
  });

  context('IAeYargsInternalBuildHandlers as class', () => {
    it('can be invoked', () => {
      const handlers = {
        onOption: AeYargsOptionHandler,
        onBeforeCommand: AeYargsBeforeCommandHandler,
        onAfterCommand: AeYargsAfterCommandHandler,
        onFail: YargsFailHandler
      };

      const handlerClient = new HandlersClientAsClass(handlers);
      handlerClient.invoke();
    });
  });
});
