/**
 * Small, dependency-free unique id. Timestamp prefix keeps ids roughly
 * sortable, the random suffix avoids collisions inside the same millisecond.
 */
export function createId(prefix = ''): string {
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}${time}${random}`;
}
