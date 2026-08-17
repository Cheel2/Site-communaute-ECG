import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charger .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Variables d\'environnement:');
console.log(`📧 SUPABASE_URL: ${supabaseUrl ? '✅ OK' : '❌ MANQUANT'}`);
console.log(`🔑 SUPABASE_KEY: ${supabaseKey ? '✅ OK' : '❌ MANQUANT'}`);
console.log('');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  console.log('🔐 Test connexion Supabase Auth');
  console.log(`📧 Email: admin@test.com`);
  console.log(`🔑 Password: Admin123!`);
  console.log('');

  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@test.com',
    password: 'Admin123!',
  });

  if (error) {
    console.error('❌ ERREUR:', error.message);
    console.error('📋 Code:', error.status);
    console.error('📋 Détails:', error);
    process.exit(1);
  }

  console.log('✅ SUCCÈS !');
  console.log(`👤 Utilisateur: ${data.user.email}`);
  console.log(`🆔 ID: ${data.user.id}`);
  console.log(`✅ Session: ${!!data.session}`);
  
  // Vérifier le rôle
  const { data: userData, error: roleError } = await supabase
    .from('utilisateur')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (roleError) {
    console.warn('⚠️ Rôle non trouvé dans utilisateur:', roleError.message);
  } else {
    console.log(`📋 Rôle: ${userData.role}`);
    console.log(`📋 Statut: ${userData.statut}`);
  }
}

testLogin();
