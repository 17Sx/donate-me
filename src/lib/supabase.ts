import { createClient } from '@supabase/supabase-js';

// URL et clé Supabase - Utilisez les variables d'environnement si disponibles
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://zujttzjyoeexxethhzsc.supabase.co';
// Utiliser la clé directement comme fallback pour le développement
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Vérification de l'existence d'un wallet
export const checkWalletExists = async (address: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('custom_links')
      .select('slug')
      .contains('wallets', [{ address }]);
      
    if (error) {
      console.error('Erreur lors de la vérification du wallet:', error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (err) {
    console.error('Erreur lors de la vérification du wallet:', err);
    return false;
  }
}; 

