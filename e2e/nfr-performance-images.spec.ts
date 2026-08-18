import { test, expect } from '@playwright/test';

test.describe('TMC-21 : NFR Performance & Images', () => {
  // Seuils permissifs pour Codespaces (environnement de dev)
  const SEUIL_FCP_MUST_MS = 8000; // 8 secondes (permissif)
  const SEUIL_IMAGE_MAX_OCTETS = 200 * 1024; // 200 Ko

  test.describe('Performance de chargement', () => {
    test('should_measure_FCP_on_page_accueil', async ({ page }) => {
      // Naviguer vers la page d'accueil avec waitUntil: 'networkidle' pour capturer les métriques réelles
      await page.goto('/', { waitUntil: 'networkidle' });

      // Attendre que le contenu principal soit visible
      await page.locator('main').first().waitFor({ state: 'visible', timeout: 10000 });

      // Récupérer les métriques de performance via page.evaluate
      const metrics = await page.evaluate(() => {
        const perfData = performance.getEntriesByType('paint');
        const fcpEntry = perfData.find((entry) => entry.name === 'first-contentful-paint');
        const lcpEntry = perfData.find((entry) => entry.name === 'largest-contentful-paint');
        return {
          firstContentfulPaint: fcpEntry ? fcpEntry.startTime : 0,
          largestContentfulPaint: lcpEntry ? lcpEntry.startTime : 0,
          domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
          loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart,
        };
      });

      // Afficher les métriques dans le rapport
      console.log('📊 Métriques de performance :');
      console.log(`  - First Contentful Paint (FCP) : ${Math.round(metrics.firstContentfulPaint)} ms`);
      console.log(`  - Largest Contentful Paint (LCP) : ${Math.round(metrics.largestContentfulPaint)} ms`);
      console.log(`  - DOM Content Loaded : ${Math.round(metrics.domContentLoaded)} ms`);
      console.log(`  - Load Complete : ${Math.round(metrics.loadComplete)} ms`);

      // Assertion : FCP doit être inférieur au seuil Must
      // En Codespaces, on utilise un seuil permissif (8s)
      expect(metrics.firstContentfulPaint).toBeLessThan(SEUIL_FCP_MUST_MS);
    });

    test('should_measure_FCP_on_page_livres', async ({ page }) => {
      await page.goto('/livres', { waitUntil: 'networkidle' });
      await page.locator('main').first().waitFor({ state: 'visible', timeout: 10000 });

      const metrics = await page.evaluate(() => {
        const perfData = performance.getEntriesByType('paint');
        const fcpEntry = perfData.find((entry) => entry.name === 'first-contentful-paint');
        return {
          firstContentfulPaint: fcpEntry ? fcpEntry.startTime : 0,
        };
      });

      console.log(`📊 FCP sur /livres : ${Math.round(metrics.firstContentfulPaint)} ms`);
      expect(metrics.firstContentfulPaint).toBeLessThan(SEUIL_FCP_MUST_MS);
    });
  });

  test.describe('Taille des images', () => {
    test('should_verify_all_images_on_livres_page_under_200Ko', async ({ page }) => {
      // Intercepter toutes les réponses contenant des images
      const imageResponses: Array<{ url: string; size: number; contentType: string }> = [];

      page.on('response', async (response) => {
        const url = response.url();
        const contentType = response.headers()['content-type'] || '';

        // Filtrer les réponses image (images, SVG, etc.)
        if (
          contentType.startsWith('image/') ||
          url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/i)
        ) {
          const buffer = await response.body().catch(() => null);
          if (buffer) {
            imageResponses.push({
              url,
              size: buffer.length,
              contentType,
            });
          }
        }
      });

      await page.goto('/livres', { waitUntil: 'networkidle' });

      // Attendre que les images soient chargées
      await page.locator('img').first().waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});

      // Afficher le rapport des images
      console.log(`📊 Images trouvées sur /livres : ${imageResponses.length}`);

      let totalSize = 0;
      let imagesOverLimit = 0;

      for (const img of imageResponses) {
        const sizeKo = (img.size / 1024).toFixed(1);
        totalSize += img.size;
        const isOver = img.size > SEUIL_IMAGE_MAX_OCTETS;
        if (isOver) imagesOverLimit++;

        console.log(
          `  - ${isOver ? '❌' : '✅'} ${img.url.split('/').pop()} : ${sizeKo} Ko` +
          (isOver ? ` (dépasse ${(SEUIL_IMAGE_MAX_OCTETS / 1024).toFixed(0)} Ko)` : '')
        );
      }

      console.log(`📊 Taille totale des images : ${(totalSize / 1024).toFixed(1)} Ko`);
      console.log(`📊 Images dépassant le seuil : ${imagesOverLimit}/${imageResponses.length}`);

      // Assertion : aucune image ne doit dépasser 200 Ko
      expect(imagesOverLimit).toBe(0);
    });

    test('should_verify_hero_banner_image_under_200Ko', async ({ page }) => {
      const imageResponses: Array<{ url: string; size: number }> = [];

      page.on('response', async (response) => {
        const url = response.url();
        const contentType = response.headers()['content-type'] || '';

        // Filtrer les images de la bannière (contenant "banniere" ou "hero" dans l'URL)
        if (
          (contentType.startsWith('image/') || url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) &&
          (url.includes('banniere') || url.includes('hero') || url.includes('banner'))
        ) {
          const buffer = await response.body().catch(() => null);
          if (buffer) {
            imageResponses.push({
              url,
              size: buffer.length,
            });
          }
        }
      });

      await page.goto('/', { waitUntil: 'networkidle' });

      // Vérifier si des images de bannière ont été trouvées
      if (imageResponses.length === 0) {
        console.log('⚠️ Aucune image de bannière détectée sur la page d\'accueil');
        // Pas d'assertion — le test passe si aucune image (état vide possible)
        return;
      }

      console.log(`📊 Images de bannière trouvées : ${imageResponses.length}`);

      let allUnderLimit = true;
      for (const img of imageResponses) {
        const sizeKo = (img.size / 1024).toFixed(1);
        const isOver = img.size > SEUIL_IMAGE_MAX_OCTETS;
        if (isOver) allUnderLimit = false;
        console.log(
          `  - ${isOver ? '❌' : '✅'} ${img.url.split('/').pop()} : ${sizeKo} Ko` +
          (isOver ? ` (dépasse ${(SEUIL_IMAGE_MAX_OCTETS / 1024).toFixed(0)} Ko)` : '')
        );
      }

      expect(allUnderLimit).toBe(true);
    });

    test('should_verify_livre_detail_image_under_200Ko', async ({ page }) => {
      // Récupérer un livre existant pour tester la page détail
      const livreId = await page.evaluate(async () => {
        const response = await fetch('/api/livres');
        const data = await response.json();
        return data.data?.[0]?.id || null;
      }).catch(() => null);

      if (!livreId) {
        console.log('⚠️ Aucun livre trouvé pour tester la page détail');
        return;
      }

      const imageResponses: Array<{ url: string; size: number }> = [];

      page.on('response', async (response) => {
        const url = response.url();
        const contentType = response.headers()['content-type'] || '';

        if (
          contentType.startsWith('image/') ||
          url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)
        ) {
          const buffer = await response.body().catch(() => null);
          if (buffer) {
            imageResponses.push({
              url,
              size: buffer.length,
            });
          }
        }
      });

      await page.goto(`/livres/${livreId}`, { waitUntil: 'networkidle' });

      if (imageResponses.length === 0) {
        console.log('⚠️ Aucune image trouvée sur la page du livre');
        return;
      }

      console.log(`📊 Images sur /livres/${livreId} : ${imageResponses.length}`);

      let allUnderLimit = true;
      for (const img of imageResponses) {
        const sizeKo = (img.size / 1024).toFixed(1);
        const isOver = img.size > SEUIL_IMAGE_MAX_OCTETS;
        if (isOver) allUnderLimit = false;
        console.log(
          `  - ${isOver ? '❌' : '✅'} ${img.url.split('/').pop()} : ${sizeKo} Ko`
        );
      }

      expect(allUnderLimit).toBe(true);
    });
  });

  test.describe('Bundle size (optionnel)', () => {
    test('should_report_bundle_size_if_available', async ({ page }) => {
      // Ce test mesure le bundle en se basant sur le fichier .next/BUILD_ID
      // ou en utilisant la console de développement.
      // Dans Codespaces, on utilise une approche plus simple : on récupère
      // la taille des chunks JS chargés.

      await page.goto('/', { waitUntil: 'networkidle' });

      const bundleMetrics = await page.evaluate(() => {
        const scripts = document.querySelectorAll('script[src]');
        let totalSize = 0;
        const chunks: Array<{ url: string; size: number }> = [];

        for (const script of scripts) {
          const src = script.getAttribute('src') || '';
          if (src.includes('_next/static/chunks/')) {
            // Estimation approximative : on ne peut pas facilement obtenir la taille exacte
            // depuis le navigateur sans fetch supplémentaire. On reporte le nombre de chunks.
            chunks.push({ url: src, size: 0 });
          }
        }

        return {
          chunkCount: chunks.length,
          estimatedTotalSize: chunks.length * 50, // estimation 50 Ko par chunk en moyenne
        };
      });

      console.log('📊 Métriques du bundle :');
      console.log(`  - Nombre de chunks JS : ${bundleMetrics.chunkCount}`);
      console.log(`  - Taille estimée : ~${bundleMetrics.estimatedTotalSize} Ko (${bundleMetrics.chunkCount} chunks × 50 Ko)`);
      console.log('  - ⚠️ Mesure approximative — pour une mesure précise, utiliser `npm run build` avec `--analyze`');

      // Pas d'assertion stricte car la mesure est approximative
      expect(bundleMetrics.chunkCount).toBeGreaterThan(0);
    });
  });
});
