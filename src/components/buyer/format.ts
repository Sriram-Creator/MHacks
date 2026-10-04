export function formatPrice(amount: number) {
  return `$${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`;
}

export function formatDistance(miles: number) {
  return `${miles.toFixed(1)} mi`;
}

export function formatMadeOn(isoDate: string) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function titleCase(value: string) {
  return value
    .split(/[\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
