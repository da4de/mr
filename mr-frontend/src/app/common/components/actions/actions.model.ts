export interface Action<T = any> {
  icon: string;
  onAction: (item: T) => void;
  outlined?: boolean | ((item: T) => boolean);
}
