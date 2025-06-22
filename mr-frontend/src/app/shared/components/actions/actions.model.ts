/** Defines the structure of an action for the ActionsComponent  */
export interface Action<T = any> {
  /** Icon identifier */
  icon: string;
  /** Callback function executed when the action is triggered */
  onAction: (item: T) => void;
  /**
   * Determines whether the action button should be outlined.
   * Can be a boolean or a callback function receiving the item.
   */
  outlined?: boolean | ((item: T) => boolean);
}
