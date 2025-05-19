/**
 * Converts a number or numeric string to BRL currency format.
 *
 * @param value - The numeric value to be converted.
 * @returns The value formatted as BRL currency.
 * @throws Error if the value is not a valid number.
 */
export default function currencyConverter(value: number | string): string {
  const numericValue = typeof value === 'number' ? value : Number(value);

  if (isNaN(numericValue)) {
    return 'NaN';
  }

  return numericValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}
