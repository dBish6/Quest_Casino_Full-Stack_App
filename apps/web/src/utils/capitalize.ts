export default function capitalize(txt: string) {
  return txt.charAt(0).toUpperCase() + txt.slice(1).replace(/([A-Z])/g, " $1");
}
