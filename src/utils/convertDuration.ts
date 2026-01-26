export function convertDuration(hours: number) {
  if (hours >= 720) {
    return `${Math.ceil(hours / 720)} bulan`
  } else if (hours >= 24) {
    return `${Math.ceil(hours / 24)} hari`
  }

  return `${hours} jam`
}
