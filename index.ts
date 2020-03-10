
import * as yargs from 'yargs';

// ============================== [api/yargs] === Yargs API Builder (Aergia) ===

/**
 * @description Yargs fail handler
 *
 * @export
 * @interface IYargsFailHandler
 */
export interface IYargsFailHandler {
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
  onFail: IYargsFailHandler;
}

export type IAeYargsBuildHandlers = Partial<IAeYargsInternalBuildHandlers>;

// -----------------------------------------------------------------------------

// =================== [json-xml-conversion] === XML/JSON Conversion (Jaxom) ===

/**
 * @description Schema to provide a description of the cli being built
 * (formerly IAeYargsSchema)
 *
 * @export
 * @interface IJsonConversionSchema
 */
export interface IJsonConversionSchema {
  labels: {
    commandNameId: string,
    commandOptions: string
    descendants: string,
    elements: string,
    validationGroups: string
  };
  paths: {
    collective: string
  };
  exclusions: {
    options: string[];
  };
}

// Coercion definitions are for those primitive types that require a coercion from
// raw string value. 'date' is not part of this list because there is no reasonable
// default for a date (eg what format should be used) and as such is not deemed a
// simple type. Also, of note, these types can be configured as part of the 'primitives'
// collection as opposed to be defined as a separate matcher in themselves.
//
export type CoercivePrimitiveStr = 'boolean' | 'number' | 'symbol';
export const CoercivePrimitiveStrArray = ['boolean', 'number', 'symbol'];
export type CoercivePrimitiveType = boolean | number | symbol;

/**
 * @description Descriptive info about an XML tag encountered during the parse
 *
 * @export
 * @interface IElementInfo
 */
export interface IElementInfo {
  readonly id?: string;
  readonly recurse?: string;
  readonly discards?: ReadonlyArray<string>;
  readonly descendants?: {
    readonly by?: string;
    readonly id?: string;
    readonly throwIfCollision?: boolean;
    readonly throwIfMissing?: boolean;
  };
}

/**
 * @description Collation of various IElementInfo's. Client can define attributes
 * which should be used by default if an element is  encountered for which there is
 * no explicit definition. Also, the common entry applies to predefined IElementInfo
 * and non defined elements which use the default (def) settings.
 * @export
 * @interface IParseInfo
 */
export interface IParseInfo {
  readonly elements: ReadonlyMap<string, IElementInfo>;
  readonly common?: IElementInfo;
  readonly def?: IElementInfo;
}

/**
 * @description Contains properties that describe associative collections
 *
 * @export
 * @interface IAssociativeCollection
 */
export interface IAssociativeCollection { // {DEF}
  delim?: string;
  keyType?: string | string[];
  valueType?: string | string[];
}

/**
 * @description Properties that apply to Xpath text nodes.
 *
 * @export
 * @interface ITextNodeCollection
 */
export interface ITextNodeCollection { // {DEF}
  assoc?: IAssociativeCollection;
  elementTypes?: ReadonlyArray<CoercivePrimitiveStr>;
}

/**
 * @description Properties that apply to Xpath attribute nodes.
 *
 * @export
 * @interface IAttributeNodeCollection
 */
export interface IAttributeNodeCollection { // {DEF}
  delim?: string;
  open?: string;
  close?: string;
  assoc?: IAssociativeCollection;
  elementTypes?: ReadonlyArray<CoercivePrimitiveStr>;
}

/**
 * @description When a value is encountered, a transform function has to be applied
 * to perform the coercion. The matchers defined here map to a transform function.
 * Coercion attempts are applied using the client defined matcher configuration.
 *
 * @export
 * @interface IMatchers
 */
export interface IMatchers { // {DEF}
  boolean?: any; // (boolean matcher doesn't need a config value)
  // collection
  date?: {
    format?: string
  };
  number?: any; // (number matcher doesn't need a config value)
  primitives?: ReadonlyArray<CoercivePrimitiveStr>;
  symbol?: {
    prefix?: string,
    global?: boolean
  };
  string?: boolean;
}

/**
 * @description Matchers that can e applied to Xpath attribute nodes.
 *
 * @export
 * @interface IAttributesMatchers
 * @extends {IMatchers}
 */
export interface IAttributesMatchers extends IMatchers {
  collection?: IAttributeNodeCollection;
}

/**
 * @description Matchers that can be applied to Xpath text nodes.
 *
 * @export
 * @interface ITextNodesMatchers
 * @extends {IMatchers}
 */
export interface ITextNodesMatchers extends IMatchers {
  collection?: ITextNodeCollection;
}
/**
 * @description Defines coercion for either text or attribute nodes.
 *
 * @export
 * @interface ICoercionEntity
 * @template T
 */
export interface ICoercionEntity<T extends IMatchers> {
  matchers?: T;
}

/**
 * @description Describes the labels used in the resultant json that capture
 * particular properties.
 *
 * @export
 * @interface IMandatorySpecLabels
 */
export interface IMandatorySpecLabels {
  // NB: attributes is always optional, since it is used as a switch to
  // activate/deactivate attributes stored as members or array
  //
  attributes?: string; // NOT DEFAULT-ABLE
  element: string;
  descendants: string;
  text: string;
}

type IPartialSpecLabels = Partial<IMandatorySpecLabels>;

/**
 * @description Defines settings for the conversion process as a whole.
 *
 * @export
 * @interface ISpec
 */
export interface ISpec {
  name: string;
  labels?: IPartialSpecLabels; // DEF
  attributes?: {
    trim?: boolean; // {DEF}
    // coercion NOT DEFAULT-ABLE. If not present, then coercion is turned off
    // (also applies to textNodes)
    //
    coercion?: ICoercionEntity<IAttributesMatchers>
  };
  textNodes?: {
    trim?: boolean;
    coercion?: ICoercionEntity<ITextNodesMatchers>
  };
}

export type SpecContext = 'attributes' | 'textNodes';

/**
 * @description Manages the retrieval of options from the spec.
 *
 * @export
 * @interface ISpecService
 */
export interface ISpecService {
  fetchOption(path: string, fallBack?: boolean): any;
  readonly elementLabel: string;
  readonly descendantsLabel: string;
  readonly textLabel: string;
  getSpec(): ISpec;
}

/**
 * @description Represents the top level component of this library. A client can
 * convert an XML document (or fragment specified by an XPath expression) into
 * a json blob.
 *
 * @export
 * @interface IConverter
 */
export interface IConverter {
  build(elementNode: Node, parseInfo: IParseInfo): any;
}

// ===================== [xpath-selectors] === XML/JSON Conversion (Zenobia) ===

export type NullableNode = Node | null;
export type Nodes = Node | Node[];

/**
 * @description xpath selector function
 *
 * @export
 * @interface ISelect
 */
export interface ISelect {
  (e: string, doc?: Node, single?: boolean): Nodes;
}

/**
 * @description xpath selector function to select a unique element by an identifying
 * attribute.
 *
 * @export
 * @interface ISelectById
 */
export interface ISelectById {
  (elementName: string, id: string, name: string, parentNode: Node): NullableNode;
}

/**
 * @description Collection of xpath selector functions.
 *
 * @export
 * @interface ISelectors
 */
export interface ISelectors {
  select: ISelect;
  selectById: ISelectById;
}

// -----------------------------------------------------------------------------

// =================================================== Dynamic CLI (Zenobia) ===

// Eventually, StringIndexableObj should be discarded and replaced by a generic
// type (perhaps IZenaElement), where the template argument, let's say S, represents
// the schema (jsonXml.IJsonConversionSchema)
//
export type StringIndexableObj = { [key: string]: any };

// This abstraction, yet to be fully defined
//
// export type JsonObject<S> = {}; // somehow, related to IJsonConversionSchema; use a type guard function

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
  (converter: IConverter, specSvc: ISpecService, parseInfo: IParseInfo,
    xpath: ISelectors): ICommander;
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
  build(xmlContent: string, converter: IConverter, processArgv?: string[]): I;
  argv(): C;
  instance: I;
}

// -----------------------------------------------------------------------------
