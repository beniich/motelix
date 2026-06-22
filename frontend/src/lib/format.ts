export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

export function fullName(person: { firstName?: string; lastName?: string }): string {
  if (!person) return '';
  return `${person.firstName || ''} ${person.lastName || ''}`.trim();
}
