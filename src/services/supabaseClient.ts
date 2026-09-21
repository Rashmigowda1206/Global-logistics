import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// If credentials are provided in .env, create live Supabase client; otherwise operate in local mode
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Persist a Logistics What-If Route Simulation to Supabase
 */
export async function saveLogisticsSimulation(params: {
  scenarioName: string;
  modalShiftPercent: number;
  bufferDaysAdded: number;
  projectedOnTimeRate: number;
  projectedDelayReductionDays: number;
  estimatedCostImpactUsd: number;
}) {
  if (!supabase) {
    console.log('[Supabase Local Mode] Logistics simulation cached locally:', params);
    return { success: true, data: params, mode: 'local' };
  }

  try {
    const { data, error } = await supabase
      .from('what_if_simulations')
      .insert([
        {
          scenario_name: params.scenarioName,
          modal_shift_percent: params.modalShiftPercent,
          buffer_days_added: params.bufferDaysAdded,
          projected_on_time_rate: params.projectedOnTimeRate,
          projected_delay_reduction_days: params.projectedDelayReductionDays,
          estimated_cost_impact_usd: params.estimatedCostImpactUsd,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    return { success: true, data, mode: 'supabase' };
  } catch (err) {
    console.warn('[Supabase Fallback] Error saving to Supabase, running locally:', err);
    return { success: false, error: err, mode: 'local' };
  }
}

/**
 * Fetch live shipments telemetry from Supabase
 */
export async function fetchLiveShipments() {
  if (!supabase) {
    return { success: true, data: null, mode: 'local' };
  }

  try {
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .limit(500);

    if (error) throw error;
    return { success: true, data, mode: 'supabase' };
  } catch (err) {
    console.warn('[Supabase Fallback] Error fetching shipments from Supabase:', err);
    return { success: false, error: err, mode: 'local' };
  }
}
