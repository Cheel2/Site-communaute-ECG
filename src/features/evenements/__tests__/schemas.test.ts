import { describe, it, expect } from 'vitest';
import { createEvenementSchema, updateEvenementSchema } from '../schemas';

describe('createEvenementSchema', () => {
  const validRecurrent = {
    titre: 'Messe dominicale',
    description: 'Messe en français',
    date_debut: '2026-08-15',
    date_fin: null,
    lieu: 'Église Saint-Pierre',
    type: 'recurrent' as const,
    image_url: null,
    statut: 'planifie',
  };

  const validSpecial = {
    titre: 'Conférence spéciale',
    description: 'Conférence sur la spiritualité',
    date_debut: '2026-08-20',
    date_fin: '2026-08-20',
    lieu: 'Salle paroissiale',
    type: 'special' as const,
    image_url: 'https://example.com/image.jpg',
    statut: 'planifie',
  };

  describe('cas nominaux', () => {
    it('should_accepter_un_evenement_recurrent_valide', () => {
      const result = createEvenementSchema.safeParse(validRecurrent);
      expect(result.success).toBe(true);
    });

    it('should_accepter_un_evenement_special_valide', () => {
      const result = createEvenementSchema.safeParse(validSpecial);
      expect(result.success).toBe(true);
    });

    it('should_accepter_date_fin_egale_a_date_debut', () => {
      const input = { ...validRecurrent, date_fin: '2026-08-15' };
      const result = createEvenementSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should_accepter_lieu_null_et_image_url_null', () => {
      const input = { ...validRecurrent, lieu: null, image_url: null };
      const result = createEvenementSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should_accepter_statut_optionnel_avec_valeur_par_defaut', () => {
      const { statut, ...input } = validRecurrent;
      const result = createEvenementSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('cas limites — type', () => {
    it('should_rejeter_type_invalide_autre_que_recurrent_ou_special', () => {
      const input = { ...validRecurrent, type: 'hebdomadaire' };
      const result = createEvenementSchema.safeParse(input);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("'recurrent' ou 'special'");
    });

    it('should_rejeter_type_avec_typo_mineure', () => {
      const input = { ...validRecurrent, type: 'reccurent' };
      const result = createEvenementSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_type_avec_majuscule', () => {
      const input = { ...validRecurrent, type: 'Recurrent' };
      const result = createEvenementSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('cas limites — champs obligatoires', () => {
    it('should_rejeter_titre_vide', () => {
      const input = { ...validRecurrent, titre: '' };
      const result = createEvenementSchema.safeParse(input);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('requis');
    });

    it('should_rejeter_titre_manquant', () => {
      const { titre, ...input } = validRecurrent;
      const result = createEvenementSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_date_debut_manquante', () => {
      const { date_debut, ...input } = validRecurrent;
      const result = createEvenementSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_accepter_description_manquante_avec_valeur_par_defaut', () => {
      const { description, ...input } = validRecurrent;
      const result = createEvenementSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('cas limites — format des dates', () => {
    it('should_rejeter_date_debut_format_invalide', () => {
      const input = { ...validRecurrent, date_debut: '15/08/2026' };
      const result = createEvenementSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_accepter_date_debut_avec_heure_parce_que_DateParse_laccepte', () => {
      const input = { ...validRecurrent, date_debut: '2026-08-15T14:30:00Z' };
      const result = createEvenementSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should_accepter_date_fin_vide_ou_null', () => {
      const input1 = { ...validRecurrent, date_fin: '' };
      const input2 = { ...validRecurrent, date_fin: null };
      expect(createEvenementSchema.safeParse(input1).success).toBe(true);
      expect(createEvenementSchema.safeParse(input2).success).toBe(true);
    });

    it('should_accepter_date_fin_avec_slash_parce_que_DateParse_laccepte', () => {
      const input = { ...validRecurrent, date_fin: '2026/08/20' };
      const result = createEvenementSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('ÉCART PLAN/CODE — date_fin >= date_debut', () => {
    it('should_ACCEPTER_date_fin_inferieure_a_date_debut_ecart_documente', () => {
      const input = { ...validRecurrent, date_debut: '2026-08-20', date_fin: '2026-08-15' };
      const result = createEvenementSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('mise à jour — héritage du même schéma', () => {
    it('should_avoir_le_meme_schema_que_createEvenementSchema', () => {
      const input = { ...validRecurrent, type: 'special' as const };
      expect(updateEvenementSchema.safeParse(input).success).toBe(true);
    });
  });
});
