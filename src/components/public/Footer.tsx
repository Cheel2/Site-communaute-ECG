import Link from 'next/link';

const LIENS_PIED_DE_PAGE = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/politique-confidentialite', label: 'Politique de confidentialité' },
  { href: '/contact', label: 'Contact' },
] as const;

export function PublicFooter() {
  const anneeActuelle = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Ministère Pastoral</p>
            <p className="mt-1 max-w-xs text-sm text-gray-600">
              Hub de contenu et de communication du ministère.
            </p>
          </div>
          <nav aria-label="Liens légaux et contact">
            <ul className="space-y-2">
              {LIENS_PIED_DE_PAGE.map((lien) => (
                <li key={lien.href}>
                  <Link
                    href={lien.href}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {lien.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-8 border-t border-gray-200 pt-4 text-xs text-gray-500">
          © {anneeActuelle} Ministère Pastoral. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}