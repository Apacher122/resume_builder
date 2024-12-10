export const titleFormat = (str) => {
    return str
    .replace(/[%#&_]/g, match => ({
        '%': '\\%',
        '#': '\\#',
        '&': '\\&',
        '_': ' '
      }[match]))
      .toLowerCase()
      .replace(/\b\w/g, s => s.toUpperCase());
}

export const formatText = (text) => {
    return text
    .replace(/%/g, '\\%')
    .replace(/#/g, '\\#')
    .replace(/&/g, '\\&')
}
