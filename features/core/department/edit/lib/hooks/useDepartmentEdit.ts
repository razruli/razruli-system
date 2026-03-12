"use client";

import { useCallback } from "react";

import { useDepartmentEditStore } from "../../model/store";

// Main feature hook: Department edit workflow
export function useDepartmentEdit() {
  const { selectedId, isOpen, isLoading, error } = useDepartmentEditStore();

  // TODO: Connect to entity hooks/mutations when available
  // const { data } = useGetDepartment(selectedId) if open;
  // const [updateDepartment] = useUpdateDepartmentMutation();

  const handleOpen = useCallback((id: string) => {
    useDepartmentEditStore.setState({
      selectedId: id,
      isOpen: true,
      error: null,
    });
  }, []);

  const handleClose = useCallback(() => {
    useDepartmentEditStore.setState({ isOpen: false });
  }, []);

  const handleSubmit = useCallback(
    async (formData: any) => {
      // TODO: Implement mutation call
      // if (!selectedId) return;
      // useDepartmentEditStore.setState({ isLoading: true });
      // try {
      //   await updateDepartment({ variables: { id: selectedId, input: formData } });
      //   useDepartmentEditStore.setState({ isOpen: false });
      // } catch (err) {
      //   useDepartmentEditStore.setState({ error: err.message });
      // } finally {
      //   useDepartmentEditStore.setState({ isLoading: false });
      // }
    },
    [selectedId],
  );

  return {
    selectedId,
    isOpen,
    isLoading,
    error,
    handleOpen,
    handleClose,
    handleSubmit,
  };
}
