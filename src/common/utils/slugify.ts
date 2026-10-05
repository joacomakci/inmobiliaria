export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // saca tildes
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // saca caracteres raros
    .replace(/\s+/g, '-') // espacios -> guiones
    .replace(/-+/g, '-'); // guiones repetidos -> uno solo
}
