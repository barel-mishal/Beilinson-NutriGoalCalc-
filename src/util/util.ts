export const formatNumber = (number: number) => {
    // Using internationalization API to format number
    return new Intl.NumberFormat('en-US').format(number)
  }