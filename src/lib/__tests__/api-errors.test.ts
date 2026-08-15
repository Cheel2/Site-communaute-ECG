import { describe, it, expect, vi } from 'vitest';
import { erreurValidation, erreurInterne, erreurNonAutorise } from '@/lib/api-errors';

describe('erreurValidation', () => {
  it('should_retourner_VALIDATION_ERROR_avec_message_personnalise', () => {
    const result = erreurValidation('Le champ email est requis.');

    expect(result.error).toEqual({
      code: 'VALIDATION_ERROR',
      message: 'Le champ email est requis.',
    });
  });

  it('should_retourner_VALIDATION_ERROR_avec_message_par_defaut_si_vide', () => {
    const result = erreurValidation('');

    expect(result.error).toEqual({
      code: 'VALIDATION_ERROR',
      message: '',
    });
  });
});

describe('erreurNonAutorise', () => {
  it('should_retourner_UNAUTHORIZED_avec_message_dauthentification', () => {
    const result = erreurNonAutorise();

    expect(result.error).toEqual({
      code: 'UNAUTHORIZED',
      message: 'Session expirée. Veuillez vous reconnecter.',
    });
  });
});

describe('erreurInterne', () => {
  it('should_retourner_INTERNAL_ERROR_avec_message_generique', () => {
    const result = erreurInterne(new Error('DB connection failed'));

    expect(result.error).toEqual({
      code: 'INTERNAL_ERROR',
      message: 'Une erreur interne est survenue. Veuillez réessayer.',
    });
  });

  it('should_log_lerreur_dans_console_avec_console_error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const erreur = new Error('Test error');
    erreurInterne(erreur);

    expect(consoleSpy).toHaveBeenCalledWith(
      '[api-errors] Erreur interne :',
      'Test error'
    );

    consoleSpy.mockRestore();
  });

  it('should_gerer_erreur_inconnue_non_Error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = erreurInterne({ some: 'object' });

    expect(result.error).toEqual({
      code: 'INTERNAL_ERROR',
      message: 'Une erreur interne est survenue. Veuillez réessayer.',
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      '[api-errors] Erreur interne :',
      'Erreur inconnue'
    );

    consoleSpy.mockRestore();
  });

});