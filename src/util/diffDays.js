const diffDays = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000
  const d1 = new Date(date1).getTime()
  const d2 = new Date(date2).getTime()

  return Math.round(Math.abs((d1 - d2) / oneDay))
}

export default diffDays
