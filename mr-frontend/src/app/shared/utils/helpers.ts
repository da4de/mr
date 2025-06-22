/**
 * Returns the difference between two sets
 * @param a The first set
 * @param b The second set
 * @returns A new set containing values present in `a` but not in `b`
 */
export function difference<T>(a: Set<T>, b: Set<T>): Set<T> {
    return new Set([...a].filter(x => !b.has(x)));
}

/**
 * Parses a JSON-formatted string into an array, if possible.
 * @param input JSON-formatted string
 * @returns Parsed array or an empty array if parsing fails
 */
export function jsonParseArray<T>(input: string): T[] | [] {
    try {
        return JSON.parse(input) as T[];
    } catch {
        return [];
    }
}

/**
 * Parses a JSON-formatted string into a Set, if possible
 * @param input JSON-formatted string
 * @returns Parsed Set or an empty Set if parsing fails
 */
export function jsonParseSet<T>(input: string): Set<T> {
    try {
        return new Set<T>(JSON.parse(input));
    } catch {
        return new Set<T>();
    }
}

/**
 * Type guard that checks if a value is a non-empty string
 * @param value The value to check
 * @returns True if the value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.length > 0;
}

/**
 * Generates a color from a predefined palette based on the given index
 * @param index Index used to select a color
 * @returns A hex color code
 */
export function generateColor(index: number): string {
  const colors = [
    '#3366CC', '#DC3912', '#FF9900', '#109618',
    '#990099', '#3B3EAC', '#0099C6', '#DD4477',
    '#66AA00', '#B82E2E', '#316395', '#994499'
  ];
  return colors[index % colors.length];
}
