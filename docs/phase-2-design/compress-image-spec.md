# Spécification Edge Function — compress-image

## Objectif

Compresser et redimensionner les images uploadées par les administrateurs avant stockage dans Supabase Storage. Garantir que chaque image respecte les contraintes du projet (≤ 1200px, ≤ 500 Ko, format WebP ou JPG).

## Interface

| Paramètre | Type | Requis | Valeur par défaut | Description |
|---|---|---|---|---|
| image | File (multipart) | Oui | — | Image brute uploadée |
| max_width | integer | Non | 1200 | Largeur maximale en pixels |
| max_size_kb | integer | Non | 500 | Taille maximale en kilo-octets |
| format | string | Non | webp | Format de sortie (webp ou jpg) |

## Traitement

1. Recevoir l'image multipart et valider son type MIME (image/*)
2. Redimensionner l'image à la largeur max spécifiée en conservant le ratio
3. Convertir l'image au format demandé (WebP ou JPG)
4. Vérifier que la taille du fichier compressé est ≤ max_size_kb
5. Si la taille dépasse la limite, réduire la qualité progressivement jusqu'à respecter la contrainte
6. Retourner l'image compressée encodée en base64 ou son URL Storage

## Sortie

```json
{
  "success": true,
  "data": {
    "url": "https://.../storage/v1/object/public/images/...",
    "width": 1200,
    "height": 800,
    "size_kb": 487,
    "format": "webp"
  }
}
```

## Erreurs

| Code HTTP | Condition | Message |
|---|---|---|
| 400 | Type MIME non image | "Le fichier doit être une image" |
| 400 | Format demandé invalide | "Le format doit être 'webp' ou 'jpg'" |
| 413 | Image compressée > max_size_kb | "L'image ne peut pas être compressée sous 500 Ko" |
| 500 | Erreur de traitement interne | "Erreur lors de la compression de l'image" |

## Contraintes

- Pas de fallback côté client — si l'Edge Function échoue, l'upload échoue
- Format de sortie limité à WebP ou JPG
- Ratio d'aspect conservé lors du redimensionnement
- Aucune métadonnée EXIF conservée dans l'image de sortie
- Temps d'exécution maximum : 10 secondes (limite Supabase Edge Function)

## Dépendances

- `https://deno.land/x/imagescript@1.2.17/mod.ts` — Manipulation d'images (redimensionnement, conversion)
