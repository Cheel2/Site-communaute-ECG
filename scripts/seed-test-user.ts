import { createClient } from '@supabase/supabase-js';

// Utiliser les clés d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const TEST_USER_EMAIL = 'test-e2e@example.com';
const TEST_USER_PASSWORD = 'Test123!';

async function seedTestUser() {
  console.log('🔍 Vérification de l\'utilisateur de test...');

  // 1. Vérifier si l'utilisateur existe déjà
  const { data: existingUser, error: searchError } = await supabase
    .from('utilisateur')
    .select('id, email, statut')
    .eq('email', TEST_USER_EMAIL)
    .single();

  if (existingUser) {
    console.log(`✅ Utilisateur ${TEST_USER_EMAIL} existe déjà (statut: ${existingUser.statut})`);
    
    // Si l'utilisateur est désactivé, le réactiver
    if (existingUser.statut === 'desactive') {
      console.log('🔄 Réactivation de l\'utilisateur...');
      await supabase
        .from('utilisateur')
        .update({ statut: 'actif', date_modification: new Date().toISOString() })
        .eq('email', TEST_USER_EMAIL);
      console.log('✅ Utilisateur réactivé');
    }
    return;
  }

  console.log('📝 Création de l\'utilisateur de test...');

  // 2. Créer l'utilisateur dans Supabase Auth
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
    email_confirm: true,
  });

  if (authError) {
    console.error('❌ Erreur création Auth:', authError.message);
    process.exit(1);
  }

  console.log(`✅ Utilisateur Auth créé: ${authUser.user.id}`);

  // 3. Créer l'enregistrement dans la table utilisateur
  const { data: userRecord, error: userError } = await supabase
    .from('utilisateur')
    .insert({
      id: authUser.user.id,
      email: TEST_USER_EMAIL,
      role: 'lecture_seule',
      statut: 'actif',
      date_creation: new Date().toISOString(),
      date_modification: new Date().toISOString(),
    })
    .select()
    .single();

  if (userError) {
    console.error('❌ Erreur création utilisateur:', userError.message);
    process.exit(1);
  }

  console.log(`✅ Utilisateur créé: ${userRecord.email} (rôle: ${userRecord.role})`);
  console.log(`✅ Mot de passe: ${TEST_USER_PASSWORD}`);
}

// Exécuter le seed
seedTestUser()
  .then(() => {
    console.log('\n✅ SEED TERMINÉ AVEC SUCCÈS');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Erreur inattendue:', err);
    process.exit(1);
  });
