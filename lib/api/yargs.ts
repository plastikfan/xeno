
import * as yargs from 'yargs';

// ============================================== Yargs API Builder (Aergia) ===

/**
 * @description Yargs fail handler
 *
 * @export
 * @interface IFailHandler
 */
export interface IFailHandler {
  (msg: string, err: Error, inst: yargs.Argv, command: any): yargs.Argv;
}

/**
 * @description Represents the default handling of command options. Basically the same as
 * IDefaultAeYargsOptionHandler except for callback parameter, which of course is not required.
 *
 * @export
 * @interface IDefaultAeYargsOptionCallback
 */
export interface IDefaultAeYargsOptionCallback {
  (yin: yargs.Argv,
    optionName: string,
    optionDef: { [key: string]: any },
    positional: boolean): yargs.Argv;
}

/**
 * @description The handler that the user passes into the builder. One of it's parameters is a
 * callback that the builder provides. The client should call this default callback in addition
 * to performing custom functionality.
 *
 * @export
 * @interface IAeYargsOptionHandler
 */
export interface IAeYargsOptionHandler {
  (yin: yargs.Argv, optionName: string, optionDef: { [key: string]: any },
    positional: boolean,
    adaptedCommand: { [key: string]: any },
    callback: IDefaultAeYargsOptionCallback): yargs.Argv;
}

/**
 * @description Invoked just prior to command creation
 *
 * @export
 * @interface IAeYargsBeforeCommandHandler
 */
export interface IAeYargsBeforeCommandHandler {
  (yin: yargs.Argv, commandDescription: string, helpDescription: string,
    adaptedCommand: { [key: string]: any }): yargs.Argv;
}

/**
 * @description Invoked just after command creation
 *
 * @export
 * @interface IAeYargsAfterCommandHandler
 */
export interface IAeYargsAfterCommandHandler {
  (yin: yargs.Argv): yargs.Argv;
}

/**
 * @description Represents the default handling of commands. Basically the same as
 * IAeYargsCommandHandler except for callback parameter, which of course is not required.
 *
 * @export
 * @interface IDefaultAeYargsCommandCallback
 */
export interface IDefaultAeYargsCommandCallback {
  (yin: yargs.Argv,
    commandName: string,
    commandDef: { [key: string]: any }): yargs.Argv;
}

/**
 * @description Collection of handler functions
 *
 * @export
 * @interface IAeYargsBuildHandlers
 */
export interface IAeYargsInternalBuildHandlers {
  onOption: IAeYargsOptionHandler;
  onBeforeCommand: IAeYargsBeforeCommandHandler;
  onAfterCommand: IAeYargsAfterCommandHandler;
  onFail: IFailHandler;
}

export type IAeYargsBuildHandlers = Partial<IAeYargsInternalBuildHandlers>;

// -----------------------------------------------------------------------------
//
// ========================================= Engine Implementation (Zenobia) ===
