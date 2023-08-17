export const valueFormatter = (number: number) =>
  `₺${Intl.NumberFormat("tr").format(number).toString()}`;
