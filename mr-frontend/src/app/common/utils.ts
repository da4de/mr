export function difference<T>(a: Set<T>, b: Set<T>): Set<T> {
    return new Set([...a].filter(x => !b.has(x)));
}

export function jsonParseArray<T>(input: string): T[] | [] {
    try {
        return JSON.parse(input) as T[];
    } catch {
        return [];
    }
}

export function jsonParseSet<T>(input: string): Set<T> {
    try {
        return new Set<T>(JSON.parse(input));
    } catch {
        return new Set<T>();
    }
}

export function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.length > 0;
}

export function generateColor(index: number): string {
  const colors = [
    '#3366CC', '#DC3912', '#FF9900', '#109618',
    '#990099', '#3B3EAC', '#0099C6', '#DD4477',
    '#66AA00', '#B82E2E', '#316395', '#994499'
  ];
  return colors[index % colors.length];
}
