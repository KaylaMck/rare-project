/**
 * Format an ISO date string (e.g. "2026-03-08") as "03/08/2026".
 *
 * The `.replace(/-/g, '/')` dodges a Safari bug: Safari parses
 * "2026-03-08" as UTC midnight, which can render as the previous day in
 * timezones west of UTC. Converting to "2026/03/08" forces Safari to
 * parse it as local time instead.
 */
export const formatPublicationDate = (isoDateString) => {
  if (!isoDateString) return ''
  return new Date(isoDateString.replace(/-/g, '/')).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })
}
