// ============================================= XML/JSON Conversion (Jaxom) ===

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

// -----------------------------------------------------------------------------
