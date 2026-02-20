// entity/user/model/table-rows/rowConfig.ts

/**
 * Row expansion strategy types
 * - 'accordion': TanStack native subRows expansion
 * - 'modal': Expansion content in modal dialog
 * - 'panel': Expansion content in side panel
 * - 'popover': Expansion content in popover
 * - 'custom': Custom expansion rendering
 */
export type RowExpandType =
  | "accordion"
  | "modal"
  | "panel"
  | "popover"
  | "custom";

/**
 * Row capability configuration
 * Defines what behaviors are available for table rows
 */
export interface RowConfig {
  // Visual behavior
  hoverable?: boolean; // Highlight row on hover
  striped?: boolean; // Alternate row background colors

  // Selection
  selectable?: boolean; // Enable row selection with checkbox

  // Expansion
  expandable?: boolean; // Enable row expansion
  expandType?: RowExpandType; // How expansion is rendered
  singleExpandOpen?: boolean; // For custom types: collapse others when expanding

  // Navigation
  navigable?: boolean; // Enable navigation on row click
}

/**
 * Default row configuration for User table
 */
export const userRowConfig: RowConfig = {
  hoverable: true,
  striped: true,
  selectable: true,
  expandable: true,
  expandType: "custom", // Default to custom (modal/panel)
  singleExpandOpen: false, // Allow multiple expansions
  navigable: false,
};
