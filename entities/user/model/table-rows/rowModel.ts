// entity/user/model/table-rows/rowModel.ts

import { type UserTableRow } from "../../type";

/**
 * Row expansion context passed to custom expansion components
 */
export interface RowExpansionContext {
  row: UserTableRow;
  isExpanded: boolean;
  onClose?: () => void;
}

/**
 * Custom expansion renderer
 * Used when expandType is 'modal', 'panel', 'popover', or 'custom'
 */
export type RowExpansionRenderer = (
  context: RowExpansionContext,
) => React.ReactNode;

/**
 * Row event handlers
 */
export interface RowEventHandlers {
  onSelectionChange?: (rowId: string, selected: boolean) => void;
  onExpansionChange?: (rowId: string, expanded: boolean) => void;
  onRowClick?: (rowId: string) => void;
}

/**
 * Row state for rendering
 */
export interface RowState {
  isSelected: boolean;
  isExpanded: boolean;
}
