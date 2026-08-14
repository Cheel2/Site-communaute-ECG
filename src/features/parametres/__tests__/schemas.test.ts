import { describe, it, expect } from 'vitest';
import { updateWhatsappSchema, updateSeoSchema } from '../schemas';

describe('updateWhatsappSchema', () => {
  describe('cas nominaux', () => {
    it('should_accepter_numero_whatsapp_avec_plus_international', () => {
      const input = { numero: '+24106000000' };
      const result = updateWhatsappSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should_accepter_numero_whatsapp_sans_plus', () => {
      const input = { numero: '24106000000' };
      const result = updateWhatsappSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should_accepter_numero_whatsapp_avec_message_defaut_optionnel', () => {
      const input = { numero: '+24106000000', message_defaut: 'Bonjour !' };
      const result = updateWhatsappSchema.safeParse(input);
      expect(result.success).toBe(true);
      expect(result.data?.message_defaut).toBe('Bonjour !');
    });

    it('should_accepter_message_defaut_vide', () => {
      const input = { numero: '+24106000000', message_defaut: '' };
      const result = updateWhatsappSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('cas limites — numéro WhatsApp', () => {
    it('should_rejeter_numero_vide', () => {
      const input = { numero: '' };
      const result = updateWhatsappSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_numero_trop_court_6_chiffres', () => {
      const input = { numero: '123456' };
      const result = updateWhatsappSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_numero_trop_long_16_chiffres', () => {
      const input = { numero: '1234567890123456' };
      const result = updateWhatsappSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_numero_avec_lettres', () => {
      const input = { numero: '+24106abcdef' };
      const result = updateWhatsappSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_numero_commencant_par_0', () => {
      const input = { numero: '024106000000' };
      const result = updateWhatsappSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_numero_avec_espaces', () => {
      const input = { numero: '+241 06 000 000' };
      const result = updateWhatsappSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_numero_avec_tirets', () => {
      const input = { numero: '+241-06-000-000' };
      const result = updateWhatsappSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});

describe('updateSeoSchema', () => {
  describe('cas nominaux', () => {
    it('should_accepter_chemin_avec_slash_initial', () => {
      const input = { chemin: '/evenements' };
      const result = updateSeoSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should_accepter_chemin_complet_avec_tous_les_champs', () => {
      const input = {
        chemin: '/a-propos',
        titre: 'À propos',
        meta_description: 'Description de la page',
        mots_cles: 'mots, clés, seo',
      };
      const result = updateSeoSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should_accepter_chemin_sans_slash_initial_et_le_normaliser_dans_laction', () => {
      // Le schéma Zod accepte, c'est l'action qui normalise
      const input = { chemin: 'evenements' };
      const result = updateSeoSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should_accepter_titre_meta_description_mots_cles_optionnels', () => {
      const input = { chemin: '/contact' };
      const result = updateSeoSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('cas limites', () => {
    it('should_rejeter_chemin_vide', () => {
      const input = { chemin: '' };
      const result = updateSeoSchema.safeParse(input);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('requis');
    });

    it('should_rejeter_chemin_avec_uniquement_espaces', () => {
      const input = { chemin: '   ' };
      const result = updateSeoSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});