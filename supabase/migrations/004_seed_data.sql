-- Rubriques initiales
INSERT INTO rubrique (nom, ordre_affichage) VALUES
('Pensées du jour', 1),
('Enseignements', 2),
('Encouragements', 3);

-- Paramètre WhatsApp (à remplacer par le vrai numéro du pasteur)
INSERT INTO parametre (cle, valeur) VALUES
('numero_whatsapp', '+24100000000');

-- Métadonnées SEO des pages publiques
INSERT INTO page_seo (chemin, titre, meta_description, mots_cles) VALUES
('/', 'Accueil — Ministère Pastoral', 'Bienvenue sur le site officiel du ministère pastoral. Découvrez nos enseignements, livres et événements.', 'ministère pastoral, enseignements, livres chrétiens, événements spirituels'),
('/contenus', 'Contenus — Ministère Pastoral', 'Explorez nos pensées du jour, enseignements et encouragements pour votre vie spirituelle.', 'pensées du jour, enseignements bibliques, encouragements, foi'),
('/livres', 'Nos Livres — Ministère Pastoral', 'Découvrez les ouvrages du pasteur. Des livres pour édifier votre foi et approfondir votre marche avec Dieu.', 'livres chrétiens, pasteur, ouvrages spirituels, foi'),
('/evenements', 'Événements — Ministère Pastoral', 'Participez aux rencontres, conférences et événements spéciaux du ministère pastoral.', 'événements, conférences, rencontres spirituelles, ministère'),
('/partenariat', 'Devenir Partenaire — Ministère Pastoral', 'Rejoignez notre partenariat financier et soutenez la propagation de la parole de Dieu.', 'partenariat, soutien, don, ministère pastoral'),
('/contact', 'Contact — Ministère Pastoral', 'Contactez le ministère pastoral. Nous sommes à votre écoute pour toute question ou demande de prière.', 'contact, prière, message, ministère pastoral'),
('/mentions-legales', 'Mentions Légales — Ministère Pastoral', 'Consultez les mentions légales du site du ministère pastoral.', 'mentions légales, site web, ministère pastoral'),
('/politique-confidentialite', 'Politique de Confidentialité — Ministère Pastoral', 'Consultez notre politique de confidentialité et la protection de vos données personnelles.', 'confidentialité, données personnelles, RGPD, ministère pastoral');

-- Bannière par défaut
INSERT INTO banniere (image_url, message) VALUES
(NULL, 'Bienvenue sur le site officiel du ministère pastoral. Que la paix du Seigneur soit avec vous.');

-- NOTE : Création de l'utilisateur administrateur (pasteur)
-- L'utilisateur admin doit être créé via l'interface Supabase Auth dashboard :
-- 1. Aller dans Authentication > Users > Add User
-- 2. Saisir l'email et le mot de passe du pasteur
-- 3. Confirmer la création
-- 4. Le profil correspondant sera automatiquement inséré dans la table "utilisateur"
--    via un trigger Supabase (à configurer) ou manuellement avec le rôle 'total'.
-- NE PAS insérer directement dans la table "utilisateur" ici — le mot de passe est géré par auth.users.
