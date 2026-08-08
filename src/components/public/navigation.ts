export type LienNavigation = {
  href: string;
  label: string;
};

export const LIENS_NAVIGATION: readonly LienNavigation[] = [
  { href: '/', label: 'Accueil' },
  { href: '/contenus', label: 'Contenus' },
  { href: '/livres', label: 'Livres' },
  { href: '/evenements', label: 'Événements' },
  { href: '/partenariat', label: 'Partenariat' },
  { href: '/contact', label: 'Contact' },
];

export function estLienActif(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname.startsWith(href);
}