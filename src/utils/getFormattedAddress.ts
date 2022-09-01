export function getFormattedAddress(address: string, before = 4, after = 4) {
  const lower = address.toLocaleLowerCase();

  return `${lower.slice(0, before)}...${lower.slice(-1 * after)}`;
}
