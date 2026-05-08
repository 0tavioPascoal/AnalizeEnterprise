export interface StatusFilterOption<T extends string> {
  label: string;
  value: T;
}

export interface StatusFilterTabsProps<T extends string> {
  value: T;
  options: StatusFilterOption<T>[];
  onChange: (value: T) => void;
}