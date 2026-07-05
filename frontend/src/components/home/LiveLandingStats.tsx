// Estadísticas de la landing alimentadas por /api/stats (datos reales),
// con los textos del copy como respaldo mientras carga o si la API no responde.

import { useEffect, useState } from 'react';
import LandingStats, { type StatItem } from './LandingStats';
import { LANDING_STATS } from '../../constants/copy';
import { obtenerStats } from '../../lib/api';

export default function LiveLandingStats() {
  const [stats, setStats] = useState<StatItem[]>(LANDING_STATS.stats);

  useEffect(() => {
    obtenerStats()
      .then((s) => {
        setStats([
          {
            id: 'productos', value: s.productos, suffix: '',
            label: 'Productos vigentes monitoreados',
            sublabel: 'Catálogo CUM de INVIMA, actualizado desde datos.gov.co', color: 'blue',
          },
          {
            id: 'solicitudes', value: s.solicitudes_vitales, suffix: '',
            label: 'Autorizaciones de importación analizadas',
            sublabel: 'Medicamentos Vitales No Disponibles (señal de escasez)', color: 'red',
          },
          {
            id: 'monitoreados', value: s.pas_con_score, suffix: '',
            label: 'Principios activos con score de riesgo',
            sublabel: `Corte ${s.mes_corte_riesgo ?? 'actual'} · modelo validado con backtest`, color: 'blue',
          },
          {
            id: 'riesgo', value: s.pas_riesgo_alto, suffix: '',
            label: 'En riesgo alto o crítico',
            sublabel: 'Score ≥ 50: señales recurrentes y recientes de escasez', color: 'green',
          },
        ]);
      })
      .catch(() => { /* se mantienen los valores del copy */ });
  }, []);

  return <LandingStats {...LANDING_STATS} stats={stats} />;
}
