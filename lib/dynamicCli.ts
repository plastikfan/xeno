
import * as jaxon from './json-xml-conversion';
import * as xpath from './xpath-selectors';

// =================================================== Dynamic CLI (Zenobia) ===

// Eventually, StringIndexableObj should be discarded and replaced by a generic
// type (perhaps IZenaElement), where the template argument, let's say S, represents
// the schema (jsonXml.IJsonConversionSchema)
//
export type StringIndexableObj = { [key: string]: any };

// This abstraction, yet to be fully defined
//
export type JsonObject<S> = {}; // somehow, related to IJsonConversionSchema; use a type guard function

/**
 * @description Builder for all commands defined in zenobia config.
 *
 * @export
 * @interface ICommander
 */
export interface ICommander {
  buildNamedCommand(commandName: string, commandsNode: Node): StringIndexableObj[];
  buildCommands(commandsNode: Node): StringIndexableObj[];
}

/**
 *
 * @export
 * @interface ICommanderFactory
 */
export interface ICommanderFactory {
  (converter: jaxon.IConverter, specSvc: jaxon.ISpecService, parseInfo: jaxon.IParseInfo,
    xpath: xpath.ISelectors): ICommander;
}

/**
 *
 *
 * @export
 * @interface IDynamicCli
 * @template C: represents the cli interface as defined by the user
 * @template I: represent the cli API being used
 */
export interface IDynamicCli<C, I> {
  load(applicationConfigPath: string): string;
  peek(processArgv?: string[]): string;
  create(): ICommander;
  build(xmlContent: string, converter: jaxon.IConverter, processArgv?: string[]): I;
  argv(): C;
  instance: I;
}
