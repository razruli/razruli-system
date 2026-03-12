"use client";

import { useCallback } from "react";

import { useEmployeeCreateStore } from "../../model/store";

// Main feature hook: Employee creation workflow
export function useEmployeeCreate() {
  const { isOpen, isLoading, error } = useEmployeeCreateStore();

  // TODO: Connect to entity mutations when available
  // const [createEmployee] = useCreateEmployeeMutation();

  const handleOpen = useCallback(() => {
    useEmployeeCreateStore.setState({ isOpen: true, error: null });
  }, []);

  const handleClose = useCallback(() => {
    useEmployeeCreateStore.setState({ isOpen: false });
  }, []);

  const handleSubmit = useCallback(async (formData: any) => {
    // TODO: Implement mutation call
    // useEmployeeCreateStore.setState({ isLoading: true });
    // try {
    //   await createEmployee({ variables: { input: formData } });
    //   useEmployeeCreateStore.setState({ isOpen: false });
    // } catch (err) {
    //   useEmployeeCreateStore.setState({ error: err.message });
    // } finally {
    //   useEmployeeCreateStore.setState({ isLoading: false });
    // }
  }, []);

  return {
    isOpen,
    isLoading,
    error,
    handleOpen,
    handleClose,
    handleSubmit,
  };
}
