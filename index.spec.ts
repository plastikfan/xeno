import { use, expect } from 'chai';
import * as yargs from 'yargs';
import * as xiberia from './index';
import dirtyChai = require('dirty-chai');
use(dirtyChai);

// "index" tests assets. NB: tests defined here are not designed to test any implementation
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
  callback: xiberia.IDefaultYargsOptionCallback): yargs.Argv {
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

function handlersClientAsFn (handlers: xiberia.IYargsInternalBuildHandlers): void {
  const yin = require('yargs');
  handlers.onOption(yin, 'widget', { one: 1 }, true, { adapted: 1 }, DefaultAeYargsOptionCallback);
  handlers.onBeforeCommand(yin, 'widget description', 'help description', { adapted: 1 });
  handlers.onAfterCommand(yin);
  handlers.onFail('error message', new Error('an error'), yin, { one: 1 });
}

class HandlersClientAsClass {
  constructor (private handlers: xiberia.IYargsInternalBuildHandlers) { }
  public invoke (): void {
    const yin = require('yargs');
    this.handlers.onOption(yin, 'widget', { one: 1 }, true, { adapted: 1 }, DefaultAeYargsOptionCallback);
    this.handlers.onBeforeCommand(yin, 'widget description', 'help description', { adapted: 1 });
    this.handlers.onAfterCommand(yin);
    this.handlers.onFail('error message', new Error('an error'), yin, { one: 1 });
  }
}

interface IXiberiaCliCore {
  shape: string;
  quantity: number;
}

interface IXiberiaCli extends xiberia.IYargsArgumentsCli, IXiberiaCliCore { }

class XiberiaFakeCli implements xiberia.IDynamicCli<IXiberiaCli, yargs.Argv> {
  constructor (private defaultCommand: string, private positionalArguments: string[]) { }

  load (applicationConfigPath: string): string {
    return 'Method not implemented.';
  }

  peek (processArgv?: string[]): string {
    // argv._[0]
    //
    const commandName = processArgv ? processArgv.slice(2)[0] : this.defaultCommand;
    return commandName.startsWith('-') || this.positionalArguments.includes(commandName)
      ? this.defaultCommand : commandName;
  }

  build (xmlContent: string, processArgv?: string[]): yargs.Argv {
    throw new Error('Method not implemented.');
  }

  argv (): IXiberiaCli {
    return this.instance.argv as unknown as IXiberiaCli;
  }

  instance: yargs.Argv;
}

class XiberiaTestYargsBuilder implements xiberia.IYargsApiBuilder {
  command (command: xiberia.PlainObject, optionHandler?: xiberia.IYargsOptionHandler): yargs.Argv {
    throw new Error('Method not implemented.');
  }

  commands (container: xiberia.PlainObject, optionHandler?: xiberia.IYargsOptionHandler): yargs.Argv {
    throw new Error('Method not implemented.');
  }

  go (instance: yargs.Argv<{}>): xiberia.PlainObject {
    throw new Error('Method not implemented.');
  }
}

describe('index', () => {
  context('given: IDefaultAeYargsOptionCallback', () => {
    it('should: can be invoked', () => {
      const fn: xiberia.IDefaultYargsOptionCallback = DefaultAeYargsOptionCallback;
      const yin = require('yargs');
      fn(yin, 'widget', { one: 1 }, true);
    });
  });

  context('given: IAeYargsOptionHandler', () => {
    it('should: can be invoked', () => {
      const fn: xiberia.IYargsOptionHandler = AeYargsOptionHandler;
      const yin = require('yargs');
      fn(yin, 'widget', { one: 1 }, true, { adapted: 1 }, DefaultAeYargsOptionCallback);
    });
  });

  context('given: IAeYargsBeforeCommandHandler', () => {
    it('should: can be invoked', () => {
      const fn: xiberia.IYargsBeforeCommandHandler = AeYargsBeforeCommandHandler;
      const yin = require('yargs');
      fn(yin, 'widget description', 'help description', { adapted: 1 });
    });
  });

  context('given: IAeYargsAfterCommandHandler', () => {
    it('should: can be invoked', () => {
      const fn: xiberia.IYargsAfterCommandHandler = AeYargsAfterCommandHandler;
      const yin = require('yargs');
      fn(yin);
    });
  });

  context('given: IDefaultAeYargsCommandCallback', () => {
    it('should: can be invoked', () => {
      const fn: xiberia.IDefaultYargsCommandCallback = DefaultAeYargsCommandCallback;
      const yin = require('yargs');
      fn(yin, 'get', { one: 1 });
    });
  });

  context('given: IYargsFailHandler', () => {
    it('should: can be invoked', () => {
      const fn: xiberia.IYargsFailHandler = YargsFailHandler;
      const yin = require('yargs');
      fn('error message', new Error('an error'), yin, { one: 1 });
    });
  });

  context('given: IAeYargsInternalBuildHandlers as function', () => {
    it('should: can be invoked', () => {
      const handlers = {
        onOption: AeYargsOptionHandler,
        onBeforeCommand: AeYargsBeforeCommandHandler,
        onAfterCommand: AeYargsAfterCommandHandler,
        onFail: YargsFailHandler
      };

      handlersClientAsFn(handlers);
    });
  });

  context('given: IAeYargsInternalBuildHandlers as class', () => {
    it('should: can be invoked', () => {
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

  context('given: IDynamicCli', () => {
    it('should: can be instantiated', () => {
      const xiberiaCli = new XiberiaFakeCli('get', ['source']);
      xiberiaCli.peek(['get', '--shape', 'triangle', '--quantity', '3']);
    });
  });

  context('given: IYargsApiBuilder', () => {
    it('should: can be invoked', () => {
      const builder: xiberia.IYargsApiBuilder = new XiberiaTestYargsBuilder();
      expect(builder).to.not.be.undefined();
    });
  });
});
