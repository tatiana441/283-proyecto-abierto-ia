// ─── Mock data for medication detail pages ───────────────────────────────────
// Keyed by URL slug (lowercase medication name).
// Swap these records for real API responses — the shape is identical to MedicationDetail.

import type { MedicationDetail } from '../types/medication';

const MOCK_MEDICATIONS: Record<string, MedicationDetail> = {
  losartán: {
    profile: {
      id: 'los-001',
      name: 'Losartán Potásico',
      activeIngredient: 'Losartán',
      therapeuticCategory: 'Antihipertensivos — Antagonistas del receptor de angiotensina II',
      pharmaceuticalForm: 'Tableta recubierta',
      administrationRoute: 'Oral',
      regulatoryStatus: 'Aprobado',
      atcCode: 'C09CA01',
      manufacturer: 'Laboratorios Lafrancol S.A.',
    },
    risk: {
      score: 42,
      level: 'monitor',
      trend: 'increasing',
      aiInsight:
        'Este medicamento ha experimentado un aumento en la demanda en los últimos periodos de reporte. ' +
        'Se recomienda consultar con su médico posibles alternativas terapéuticas en caso de dificultad de acceso.',
      lastUpdated: '2025-06-10T00:00:00Z',
      reportingPeriods: 3,
    },
    pricing: {
      averageMarketPrice: 18_500,
      maxRegulatedPrice:  22_000,
      currency: 'COP',
      priceHistory: [
        { period: 'Ene 25', price: 15_000 },
        { period: 'Feb 25', price: 15_800 },
        { period: 'Mar 25', price: 16_200 },
        { period: 'Abr 25', price: 17_500 },
        { period: 'May 25', price: 18_000 },
        { period: 'Jun 25', price: 18_500 },
      ],
    },
    timeline: [
      {
        id: 't1',
        date: '2019-03-15',
        title: 'Aprobación INVIMA',
        description: 'Registro sanitario aprobado bajo resolución INVIMA 2019-001234.',
        type: 'approval',
      },
      {
        id: 't2',
        date: '2022-08-01',
        title: 'Inicio de monitoreo preventivo',
        description: 'Incluido en el programa de vigilancia de desabastecimiento del Ministerio de Salud.',
        type: 'monitoring',
      },
      {
        id: 't3',
        date: '2024-11-20',
        title: 'Alerta moderada de desabastecimiento',
        description: 'Reducción del 30% en unidades importadas durante el tercer trimestre de 2024.',
        type: 'shortage',
      },
      {
        id: 't4',
        date: '2025-02-05',
        title: 'Situación parcialmente normalizada',
        description: 'Importación reactivada. Stock disponible en principales distribuidoras regionales.',
        type: 'resolved',
      },
      {
        id: 't5',
        date: '2025-06-01',
        title: 'Alerta activa — monitoreo intensivo',
        description: 'Incremento de demanda detectado. Monitoreo semanal activado por el MSPS.',
        type: 'alert',
      },
    ],
    alternatives: [
      {
        id: 'a1',
        name: 'Valsartán',
        activeIngredient: 'Valsartán',
        riskLevel: 'low',
        riskScore: 18,
        similarity: 'Misma categoría terapéutica',
      },
      {
        id: 'a2',
        name: 'Irbesartán',
        activeIngredient: 'Irbesartán',
        riskLevel: 'low',
        riskScore: 12,
        similarity: 'Mismo principio activo',
      },
      {
        id: 'a3',
        name: 'Enalapril',
        activeIngredient: 'Enalapril maleato',
        riskLevel: 'low',
        riskScore: 9,
        similarity: 'Mecanismo similar',
      },
      {
        id: 'a4',
        name: 'Olmesartán',
        activeIngredient: 'Olmesartán medoxomilo',
        riskLevel: 'monitor',
        riskScore: 38,
        similarity: 'Misma categoría terapéutica',
      },
    ],
  },

  metformina: {
    profile: {
      id: 'met-001',
      name: 'Metformina Clorhidrato',
      activeIngredient: 'Metformina',
      therapeuticCategory: 'Antidiabéticos — Biguanidas',
      pharmaceuticalForm: 'Tableta de liberación prolongada',
      administrationRoute: 'Oral',
      regulatoryStatus: 'Aprobado',
      atcCode: 'A10BA02',
      manufacturer: 'Genfar Colombia S.A.',
    },
    risk: {
      score: 15,
      level: 'low',
      trend: 'stable',
      aiInsight:
        'La Metformina presenta abastecimiento estable a nivel nacional. ' +
        'No se registran alertas activas. La producción local cubre la demanda proyectada para el próximo semestre.',
      lastUpdated: '2025-06-12T00:00:00Z',
    },
    pricing: {
      averageMarketPrice: 6_800,
      maxRegulatedPrice:  9_000,
      currency: 'COP',
      priceHistory: [
        { period: 'Ene 25', price: 6_200 },
        { period: 'Feb 25', price: 6_300 },
        { period: 'Mar 25', price: 6_500 },
        { period: 'Abr 25', price: 6_600 },
        { period: 'May 25', price: 6_700 },
        { period: 'Jun 25', price: 6_800 },
      ],
    },
    timeline: [
      {
        id: 't1',
        date: '2015-06-10',
        title: 'Aprobación INVIMA — registro original',
        description: 'Primera aprobación de Metformina 500mg y 850mg bajo registro 20155M.',
        type: 'approval',
      },
      {
        id: 't2',
        date: '2021-01-15',
        title: 'Ampliación de registro — 1000mg',
        description: 'Aprobada la presentación de 1000mg de liberación prolongada.',
        type: 'approval',
      },
    ],
    alternatives: [
      {
        id: 'a1',
        name: 'Sitagliptina',
        activeIngredient: 'Sitagliptina fosfato',
        riskLevel: 'monitor',
        riskScore: 45,
        similarity: 'Misma categoría terapéutica',
      },
    ],
  },

  insulina: {
    profile: {
      id: 'ins-001',
      name: 'Insulina Glargina',
      activeIngredient: 'Insulina glargina',
      therapeuticCategory: 'Antidiabéticos — Insulinas de acción prolongada',
      pharmaceuticalForm: 'Solución inyectable',
      administrationRoute: 'Subcutánea',
      regulatoryStatus: 'Aprobado',
      atcCode: 'A10AE04',
      manufacturer: 'Sanofi-Aventis de Colombia S.A.',
    },
    risk: {
      score: 78,
      level: 'high',
      trend: 'increasing',
      aiInsight:
        'Se han detectado faltantes críticos de Insulina Glargina en varias regiones del país. ' +
        'La demanda supera la oferta disponible en un 40%. Se sugiere contactar a su EPS con urgencia ' +
        'y consultar con su médico tratante sobre alternativas de insulina basal disponibles.',
      lastUpdated: '2025-06-14T00:00:00Z',
      reportingPeriods: 5,
    },
    pricing: {
      averageMarketPrice: 185_000,
      maxRegulatedPrice:  210_000,
      currency: 'COP',
      priceHistory: [
        { period: 'Ene 25', price: 162_000 },
        { period: 'Feb 25', price: 168_000 },
        { period: 'Mar 25', price: 172_000 },
        { period: 'Abr 25', price: 178_000 },
        { period: 'May 25', price: 181_000 },
        { period: 'Jun 25', price: 185_000 },
      ],
    },
    timeline: [
      {
        id: 't1',
        date: '2010-04-20',
        title: 'Aprobación inicial INVIMA',
        description: 'Registro sanitario original para Insulina Glargina 100 UI/mL.',
        type: 'approval',
      },
      {
        id: 't2',
        date: '2023-03-01',
        title: 'Inicio de monitoreo por escasez global',
        description: 'INVIMA activa monitoreo ante reducción de disponibilidad internacional.',
        type: 'monitoring',
      },
      {
        id: 't3',
        date: '2024-09-10',
        title: 'Alerta de desabastecimiento — Nivel 2',
        description: 'Desabastecimiento confirmado en regiones de Caribe, Llanos y Pacífico.',
        type: 'shortage',
      },
      {
        id: 't4',
        date: '2025-06-14',
        title: 'Alerta crítica activa',
        description: 'Crisis de suministro en todo el país. MSPS activó protocolo de emergencia sanitaria.',
        type: 'alert',
      },
    ],
    alternatives: [
      {
        id: 'a1',
        name: 'Insulina Detemir',
        activeIngredient: 'Insulina detemir',
        riskLevel: 'monitor',
        riskScore: 55,
        similarity: 'Mismo principio activo',
      },
      {
        id: 'a2',
        name: 'Insulina NPH',
        activeIngredient: 'Insulina isofana humana',
        riskLevel: 'low',
        riskScore: 22,
        similarity: 'Mecanismo similar',
      },
    ],
  },
};

export function getMedicationBySlug(slug: string): MedicationDetail | null {
  const key = slug.toLowerCase().trim();
  return MOCK_MEDICATIONS[key] ?? MOCK_MEDICATIONS['losartán'] ?? null;
}

export default MOCK_MEDICATIONS;
