# Analyse des compromis

## Méthode

Chaque compromis est évalué selon le contexte du projet (monolithe simple, équipe réduite, budget gratuit). La décision privilégie la simplicité opérationnelle et la maintenabilité à court terme, avec des seuils de réévaluation clairs.

## Tableau des compromis

| ID | Compromis | Contexte | Décision prise | Ce qu'on sacrifie | Ce qu'on gagne |
|---|---|---|---|---|---|
| T1 | Rendu public / admin | Le back-office a un trafic faible (2-3 utilisateurs) | SSG pour le public, SSR pour l'admin | FCP optimal du back-office | Simplicité de maintenance, données admin toujours fraîches |
| T2 | Index contenu | La requête d'accueil filtre sur statut + date | Index simple sur date_publication (composite ajouté comme index manquant) | Perf max de la requête accueil | Lisibilité du schéma, maintenance simplifiée |
| T3 | Statistiques | Conservation indéfinie requise par la spécification | Conservation indéfinie, archivage à 400K lignes | Simplicité à long terme | Zéro complexité au lancement |
| T4 | UI Library | Pas de designer dédié, délai court | Tailwind CSS pur, shadcn/ui reporté Phase 3 | Vitesse de développement initial | Contrôle total du markup et du style, zéro dépendance UI |
| T5 | Revalidation | Revalidation globale plus simple conceptuellement | Tag-based par entité | Simplicité revalidation globale | Précision (seules les pages impactées sont re-rendues), performance |
| T6 | Compression images | Fallback client offre une résilience supplémentaire | Edge Function seule, pas de fallback client | Résilience en cas de panne de l'Edge Function | Simplicité côté client, garantie du respect des contraintes |
| T7 | Plan Supabase | Plan payant offre des limites 8x supérieures | Rester free, migrer quand 2 des 3 seuils atteints | Tranquillité d'esprit | Zéro coût opérationnel au lancement |
| T8 | Stratégie de suppression | Soft-delete généralisé permet de récupérer toutes les données | Hard-delete contenus/livres/événements, soft-delete uniquement utilisateurs | Récupération des contenus supprimés par erreur | Simplicité du schéma et des requêtes |

## Points de vigilance

| ID | Seuil de réévaluation |
|---|---|
| T1 | Si le back-office devient lent (FCP > 3s) ou si le nombre d'administrateurs dépasse 10 simultanés |
| T2 | Si la requête d'accueil dépasse 200ms en production malgré l'index composite |
| T3 | Si la table statistique atteint 300K lignes (préparation de l'archivage à 400K) |
| T4 | Si le développement UI ralentit significativement sans composants prêts à l'emploi |
| T5 | Si le nombre de tags de revalidation dépasse 20 et devient difficile à maintenir |
| T6 | Si l'Edge Function présente plus de 3 pannes par mois |
| T7 | Si 2 des 3 seuils (storage 400MB, DB 400K lignes, bande passante 80GB) sont atteints |
| T8 | Si le pasteur demande explicitement une corbeille de récupération pour les contenus |
