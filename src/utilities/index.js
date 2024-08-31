export function shortenDescription(desc, shortDescSize) {
  if (desc.length < shortDescSize) return desc
  const lastSpace = desc.slice(0, shortDescSize).lastIndexOf(' ')
  return `${desc.slice(0, lastSpace)} ...`
}

export const randomHash = () => Math.random().toString(36).slice(2)
