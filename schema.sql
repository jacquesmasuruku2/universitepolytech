
-- 1. Ajout de la colonne author si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='news' AND column_name='author') THEN
        ALTER TABLE public.news ADD COLUMN author TEXT;
    END IF;
END $$;

-- 2. Mise à jour des anciennes lignes avec un auteur par défaut
UPDATE public.news SET author = 'Admin UPG' WHERE author IS NULL;

-- 3. Rendre le champ obligatoire pour les futures insertions
ALTER TABLE public.news ALTER COLUMN author SET NOT NULL;

-- 4. Ajout de la colonne views
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='news' AND column_name='views') THEN
        ALTER TABLE public.news ADD COLUMN views INTEGER DEFAULT 0;
    END IF;
END $$;

-- 5. Fonction robuste pour incrémenter les vues
-- On utilise le transtypage ::text pour l'ID afin de supporter à la fois les UUID et les TEXT
CREATE OR REPLACE FUNCTION increment_news_views(news_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE news
  SET views = COALESCE(views, 0) + 1
  WHERE id::text = news_id;
END;
$$ LANGUAGE plpgsql;

-- 6. Accorder la permission d'exécution au rôle anonyme (très important pour Supabase)
GRANT EXECUTE ON FUNCTION increment_news_views(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION increment_news_views(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_news_views(TEXT) TO service_role;
