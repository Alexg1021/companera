/** Hardcoded payer-dashboard aggregates for prototype (Phase 3). */

export const dashboardMetrics = {
  retentionRate: { value: 94, label: "Retención anual", delta: "+2.1% vs trimestre anterior" },
  activeMembers: { label: "Personas activas", delta: "+3.4% vs trimestre anterior" },
  costPerMember: { value: 412, label: "Costo evitado / persona (USD)", delta: "−$18 vs meta" },
  erReduction: { value: 22, label: "Reducción visitas ER", delta: "−4 pts vs año anterior", suffix: "%" },
} as const;

export type Hedismetric = { code: string; label: string; value: number };

export const hedisMetrics: Hedismetric[] = [
  { code: "CBP", label: "Control de presión (CBP)", value: 76 },
  { code: "COL", label: "Cribado colorrectal (COL)", value: 68 },
  { code: "GSD", label: "Atención diabetes (GSD)", value: 71 },
  { code: "WCC", label: "Visitas niños bien (WCC)", value: 82 },
];

export const activePlans = [
  { name: "Health Net Medicaid", enrolled: 6200, status: "Activo" as const },
  { name: "Anthem Blue Cross", enrolled: 4100, status: "Activo" as const },
  { name: "LA Care", enrolled: 2540, status: "Piloto" as const },
];
