const BALISES_REGEX = /<[^>]*>/g;
const ESPACE_INSECABLE_REGEX = /&nbsp;/g;

export function extraireExtraitTexte(html: string, longueurMax: number): string {
  const texteBrut = html
    .replace(BALISES_REGEX, ' ')
    .replace(ESPACE_INSECABLE_REGEX, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (texteBrut.length <= longueurMax) {
    return texteBrut;
  }

  return `${texteBrut.slice(0, longueurMax).trimEnd()}…`;
}

export function formaterDateFrancaise(dateIso: string): string {
  const date = new Date(dateIso);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}