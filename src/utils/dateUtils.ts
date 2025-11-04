/**
 * Format a date/time to Brazil timezone (America/Sao_Paulo) in ISO format with timezone offset
 * @param date - Date object or datetime string (for datetime-local inputs). If not provided, uses current time.
 * @returns ISO 8601 formatted string with timezone offset (e.g., "2024-01-15T14:30:00-03:00")
 */
export const toBrazilIso = (date?: Date | string): string => {
  const d = date ? (typeof date === 'string' ? new Date(date) : date) : new Date();
  
  // Get parts in Sao Paulo TZ
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  });
  const parts = fmt.formatToParts(d).reduce<Record<string, string>>((acc, p) => { acc[p.type] = p.value; return acc; }, {});
  const yyyy = parts.year, MM = parts.month, dd = parts.day;
  const HH = parts.hour, mm = parts.minute, ss = parts.second;
  
  // Determine offset for Sao Paulo at this time
  const tzDate = new Date(`${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}`);
  const spNow = new Date(tzDate.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const utcNow = new Date(tzDate.toLocaleString('en-US', { timeZone: 'UTC' }));
  const diffMin = Math.round((spNow.getTime() - utcNow.getTime()) / 60000);
  const sign = diffMin >= 0 ? '+' : '-';
  const abs = Math.abs(diffMin);
  const offH = String(Math.floor(abs / 60)).padStart(2, '0');
  const offM = String(abs % 60).padStart(2, '0');
  
  return `${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}${sign}${offH}:${offM}`;
};

/**
 * Get current date and time in Brazil timezone (America/Sao_Paulo) in ISO format with timezone offset
 * Convenience function that calls toBrazilIso() without arguments
 */
export const getCurrentBrazilTime = (): string => {
  return toBrazilIso();
};

