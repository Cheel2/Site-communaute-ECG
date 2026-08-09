/**
 * Contenu légal statique structuré pour rendu React natif sécurisé.
 * Aucune chaîne HTML brute : le rendu est assuré par balisage sémantique
 * dans les pages (h1/h2/p/ul), sans dangerouslySetInnerHTML.
 */

export interface SectionLegale {
  titre: string;
  niveau: "h1" | "h2";
  contenu: string;
  liste?: string[];
}

export const MENTIONS_LEGALES: SectionLegale[] = [
  {
    titre: "Mentions légales",
    niveau: "h1",
    contenu:
      "Les présentes mentions légales décrivent l'identité de l'éditeur du site, les coordonnées de l'hébergeur ainsi que les conditions d'utilisation du site du ministère pastoral.",
  },
  {
    titre: "Éditeur du site",
    niveau: "h2",
    contenu:
      "Le site est édité par le ministère pastoral. Pour toute question relative au contenu du site, vous pouvez utiliser le formulaire de contact.",
    liste: [
      "Responsable de la publication : le pasteur en exercice.",
      "Contact : accessible depuis la page Contact du site.",
    ],
  },
  {
    titre: "Hébergement",
    niveau: "h2",
    contenu:
      "Le site est hébergé sur une infrastructure gratuite et mutualisée. Les données sont stockées chez des prestataires techniques sélectionnés pour leur fiabilité.",
    liste: [
      "Hébergement applicatif : Vercel Inc.",
      "Base de données et stockage : Supabase Inc.",
    ],
  },
  {
    titre: "Propriété intellectuelle",
    niveau: "h2",
    contenu:
      "L'ensemble des contenus publiés sur ce site (textes, images, logos) est protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation préalable écrite est interdite.",
  },
  {
    titre: "Responsabilité",
    niveau: "h2",
    contenu:
      "Les informations publiées sur ce site sont fournies à titre informatif et spirituel. Le ministère s'efforce d'en assurer l'exactitude mais ne saurait être tenu responsable de l'usage qui en est fait. Les liens externes pointant vers des sites tiers n'engagent pas la responsabilité du ministère.",
  },
  {
    titre: "Contact",
    niveau: "h2",
    contenu:
      "Pour toute question relative aux présentes mentions légales, vous pouvez nous écrire via le formulaire de contact disponible sur le site.",
  },
];

export const POLITIQUE_CONFIDENTIALITE: SectionLegale[] = [
  {
    titre: "Politique de confidentialité",
    niveau: "h1",
    contenu:
      "La présente politique décrit la manière dont le ministère pastoral collecte, utilise et protège les données personnelles des visiteurs, conformément à une démarche de conformité simplifiée au RGPD.",
  },
  {
    titre: "Données collectées",
    niveau: "h2",
    contenu:
      "Le site collecte uniquement les données strictement nécessaires, fournies volontairement par les visiteurs via les formulaires.",
    liste: [
      "Formulaire de contact : nom, adresse e-mail et message.",
      "Formulaire de partenariat : nom, adresse e-mail et pays.",
      "Aucune donnée n'est collectée à votre insu et aucun cookie de suivi publicitaire n'est utilisé.",
    ],
  },
  {
    titre: "Utilisation des données",
    niveau: "h2",
    contenu:
      "Les données transmises via les formulaires servent exclusivement à répondre à vos demandes, à gérer les partenariats et à assurer le suivi statistique anonyme de fréquentation. Elles ne sont jamais vendues ni partagées avec des tiers.",
  },
  {
    titre: "Cookies",
    niveau: "h2",
    contenu:
      "Le site utilise uniquement des cookies techniques essentiels au fonctionnement du service, notamment la mémorisation de votre choix de consentement. Aucun cookie de mesure d'audience tiers ni de publicité n'est déposé.",
  },
  {
    titre: "Durée de conservation",
    niveau: "h2",
    contenu:
      "Les données des formulaires sont conservées aussi longtemps que nécessaire au traitement de votre demande. Les statistiques de fréquentation sont anonymes et conservées de manière agrégée.",
  },
  {
    titre: "Vos droits",
    niveau: "h2",
    contenu:
      "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous via le formulaire de contact ; votre demande sera traitée manuellement par l'équipe du ministère.",
  },
  {
    titre: "Contact",
    niveau: "h2",
    contenu:
      "Pour toute question relative à la protection de vos données personnelles, vous pouvez nous écrire via le formulaire de contact du site.",
  },
];