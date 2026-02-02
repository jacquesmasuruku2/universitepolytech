import { createClient } from '@supabase/supabase-js';

/**
 * CONFIGURATION DU NOUVEAU PROJET UPG DÉDIÉ
 * Ces clés proviennent de votre nouveau compte Google / Projet Supabase.
 */
const supabaseUrl: string = 'https://pynpzefefsayraivncjy.supabase.co'; 
// Utilisation de la nouvelle clé anon qui correspond au projet 'pynpzefef'
const supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5bnB6ZWZlZnNheXJhaXZuY2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NDY5NTIsImV4cCI6MjA4NDMyMjk1Mn0.Wgs3yfVDG1IsO_qcLxM_qtDkpBL6CNGyEudGjKOxDeQ'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Vérifie si le client est configuré.
 */
export const isSupabaseConfigured = () => {
  return (
    supabaseUrl !== '' && 
    supabaseAnonKey !== '' &&
    !supabaseUrl.includes('votre-projet')
  );
};