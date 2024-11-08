export function object_or_ref(tx, value) {
  if (typeof value === 'string') return tx.object(value)
  return value
}
