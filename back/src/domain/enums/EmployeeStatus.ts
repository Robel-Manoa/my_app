// src/domain/enums/EmployeeStatus.ts

/**
 * Statut d'un employé dans le système
 */
export enum EmployeeStatus {
  /** Employé actif et pleinement opérationnel */
  ACTIVE = 'ACTIVE',

  /** Employé inactif (départ, suspension, etc.) */
  INACTIVE = 'INACTIVE',

  /** Employé en congé (maternité, maladie, sabbatique, etc.) */
  ON_LEAVE = 'ON_LEAVE',
}

/**
 * Helper pour vérifier si un statut est actif
 */
export const isActiveStatus = (status: EmployeeStatus): boolean => {
  return status === EmployeeStatus.ACTIVE;
};

/**
 * Liste des statuts possibles (utile pour les validations et dropdowns)
 */
export const EmployeeStatusList = [
  { value: EmployeeStatus.ACTIVE, label: 'Actif' },
  { value: EmployeeStatus.INACTIVE, label: 'Inactif' },
  { value: EmployeeStatus.ON_LEAVE, label: 'En Congé' },
] as const;