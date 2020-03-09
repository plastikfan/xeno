
// =========================================== XML/JSON Conversion (Zenobia) ===

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
