"use client";

import { useCallback } from "react";

import { useEmployeeEditStore } from "../../model/store";

// Main feature hook: Employee edit workflow
export function useEmployeeEdit() {
  const { selectedId, isOpen, isLoading, error } = useEmployeeEditStore();

  // TODO: Connect to entity hooks/mutations when available
  // const { data } = useGetEmployee(selectedId) if open;
  // const [updateEmployee] = useUpdateEmployeeMutation();

  const handleOpen = useCallback((id: string) => {
    useEmployeeEditStore.setState({
      selectedId: id,
      isOpen: true,
      error: null,
    });
  }, []);

  const handleClose = useCallback(() => {
    useEmployeeEditStore.setState({ isOpen: false });
  }, []);

  const handleSubmit = useCallback(
    async (formData: any) => {
      // TODO: Implement mutation call
      // if (!selectedId) return;
      // useEmployeeEditStore.setState({ isLoading: true });
      // try {
      //   await updateEmployee({ variables: { id: selectedId, input: formData } });
      //   useEmployeeEditStore.setState({ isOpen: false });
      // } catch (err) {
      //   useEmployeeEditStore.setState({ error: err.message });
      // } finally {
      //   useEmployeeEditStore.setState({ isLoading: false });
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
