"use client";

import { useCallback } from "react";

import { useDepartmentCreateStore } from "../../model/store";

// Main feature hook: Department creation workflow
export function useDepartmentCreate() {
  const { isOpen, isLoading, error } = useDepartmentCreateStore();

  // TODO: Connect to entity mutations when available
  // const [createDepartment] = useCreateDepartmentMutation();

  const handleOpen = useCallback(() => {
    useDepartmentCreateStore.setState({ isOpen: true, error: null });
  }, []);

  const handleClose = useCallback(() => {
    useDepartmentCreateStore.setState({ isOpen: false });
  }, []);

  const handleSubmit = useCallback(async (formData: any) => {
    // TODO: Implement mutation call
    // useDepartmentCreateStore.setState({ isLoading: true });
    // try {
    //   await createDepartment({ variables: { input: formData } });
    //   useDepartmentCreateStore.setState({ isOpen: false });
    // } catch (err) {
    //   useDepartmentCreateStore.setState({ error: err.message });
    // } finally {
    //   useDepartmentCreateStore.setState({ isLoading: false });
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
