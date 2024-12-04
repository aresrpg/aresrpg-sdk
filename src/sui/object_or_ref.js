export function object_or_ref(value) {
  if (typeof value === 'string') return tx => tx.object(value)
  return value
}
