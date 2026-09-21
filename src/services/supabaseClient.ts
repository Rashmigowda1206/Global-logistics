import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// If credentials are provided in .env, create live Supabase client; otherwise create stub
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Persist a What-If Retention Simulation to Supabase
 */
export async function saveSimulationResult(params: {
  interestBonus: number;
  germanyCoverage: number;
  multiProductDiscount: number;
  reactivationBudget: number;
  projectedChurnRate: number;
  accountsSaved: number;
  capitalSavedM: number;
}) {
  if (!supabase) {
    console.log('[Supabase Demo Mode] Simulation saved locally:', params);
    return { success: true, data: params, mode: 'local' };
  }

  try {
    const { data, error } = await supabase
      .from('churn_simulations')
      .insert([
        {
          interest_bonus: params.interestBonus,
          germany_coverage: params.germanyCoverage,
          bundle_discount: params.multiProductDiscount,
          reactivation_budget_k: params.reactivationBudget,
          projected_churn_rate: params.projectedChurnRate,
          accounts_saved: params.accountsSaved,
          capital_saved_m: params.capitalSavedM,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    return { success: true, data, mode: 'supabase' };
  } catch (err) {
    console.warn('Error saving to Supabase, falling back to local:', err);
    return { success: false, error: err, mode: 'local' };
  }
}
