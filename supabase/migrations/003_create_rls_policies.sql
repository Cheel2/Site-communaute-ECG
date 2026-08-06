-- Activation RLS sur toutes les tables concernées
ALTER TABLE rubrique ENABLE ROW LEVEL SECURITY;
ALTER TABLE contenu ENABLE ROW LEVEL SECURITY;
ALTER TABLE livre ENABLE ROW LEVEL SECURITY;
ALTER TABLE evenement ENABLE ROW LEVEL SECURITY;
ALTER TABLE banniere ENABLE ROW LEVEL SECURITY;
ALTER TABLE partenaire ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE utilisateur ENABLE ROW LEVEL SECURITY;
ALTER TABLE parametre ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE brouillon ENABLE ROW LEVEL SECURITY;

-- rubrique
CREATE POLICY "Anonymes peuvent lire les rubriques" ON rubrique FOR SELECT TO anon USING (true);
CREATE POLICY "Admins totaux peuvent tout faire sur les rubriques" ON rubrique FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif')) WITH CHECK (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif'));
CREATE POLICY "Admins lecture seule peuvent lire les rubriques" ON rubrique FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'lecture_seule' AND u.statut = 'actif'));

-- contenu
CREATE POLICY "Anonymes peuvent lire les contenus publies" ON contenu FOR SELECT TO anon USING (statut = 'publie');
CREATE POLICY "Admins totaux peuvent tout faire sur les contenus" ON contenu FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif')) WITH CHECK (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif'));
CREATE POLICY "Admins lecture seule peuvent lire les contenus" ON contenu FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'lecture_seule' AND u.statut = 'actif'));

-- livre
CREATE POLICY "Anonymes peuvent lire les livres" ON livre FOR SELECT TO anon USING (true);
CREATE POLICY "Admins totaux peuvent tout faire sur les livres" ON livre FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif')) WITH CHECK (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif'));
CREATE POLICY "Admins lecture seule peuvent lire les livres" ON livre FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'lecture_seule' AND u.statut = 'actif'));

-- evenement
CREATE POLICY "Anonymes peuvent lire les evenements" ON evenement FOR SELECT TO anon USING (true);
CREATE POLICY "Admins totaux peuvent tout faire sur les evenements" ON evenement FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif')) WITH CHECK (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif'));
CREATE POLICY "Admins lecture seule peuvent lire les evenements" ON evenement FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'lecture_seule' AND u.statut = 'actif'));

-- banniere
CREATE POLICY "Anonymes peuvent lire la banniere" ON banniere FOR SELECT TO anon USING (true);
CREATE POLICY "Admins totaux peuvent tout faire sur la banniere" ON banniere FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif')) WITH CHECK (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif'));
CREATE POLICY "Admins lecture seule peuvent lire la banniere" ON banniere FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'lecture_seule' AND u.statut = 'actif'));

-- partenaire
CREATE POLICY "Anonymes peuvent creer des partenaires" ON partenaire FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admins totaux peuvent tout faire sur les partenaires" ON partenaire FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif')) WITH CHECK (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif'));
CREATE POLICY "Admins lecture seule peuvent lire les partenaires" ON partenaire FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'lecture_seule' AND u.statut = 'actif'));

-- contact
CREATE POLICY "Anonymes peuvent creer des contacts" ON contact FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admins totaux peuvent tout faire sur les contacts" ON contact FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif')) WITH CHECK (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif'));
CREATE POLICY "Admins lecture seule peuvent lire les contacts" ON contact FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'lecture_seule' AND u.statut = 'actif'));

-- utilisateur
CREATE POLICY "Admins totaux peuvent tout faire sur les utilisateurs" ON utilisateur FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif')) WITH CHECK (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif'));
CREATE POLICY "Admins lecture seule peuvent lire les utilisateurs" ON utilisateur FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'lecture_seule' AND u.statut = 'actif'));

-- parametre
CREATE POLICY "Anonymes peuvent lire le numero whatsapp" ON parametre FOR SELECT TO anon USING (cle = 'numero_whatsapp');
CREATE POLICY "Admins totaux peuvent tout faire sur les parametres" ON parametre FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif')) WITH CHECK (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif'));
CREATE POLICY "Admins lecture seule peuvent lire les parametres" ON parametre FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'lecture_seule' AND u.statut = 'actif'));

-- page_seo
CREATE POLICY "Anonymes peuvent lire le SEO des pages" ON page_seo FOR SELECT TO anon USING (true);
CREATE POLICY "Admins totaux peuvent tout faire sur le SEO" ON page_seo FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif')) WITH CHECK (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif'));
CREATE POLICY "Admins lecture seule peuvent lire le SEO" ON page_seo FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'lecture_seule' AND u.statut = 'actif'));

-- brouillon
CREATE POLICY "Admins totaux peuvent tout faire sur les brouillons" ON brouillon FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif')) WITH CHECK (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'total' AND u.statut = 'actif'));
CREATE POLICY "Admins lecture seule peuvent lire les brouillons" ON brouillon FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM utilisateur u WHERE u.id = auth.uid() AND u.role = 'lecture_seule' AND u.statut = 'actif'));

-- statistique : aucune policy publique, accès uniquement via service_role (bypass RLS natif)
