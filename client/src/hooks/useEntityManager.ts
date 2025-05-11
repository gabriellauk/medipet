import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';

export function useEntityManager<T>() {
  const [opened, { open, close }] = useDisclosure(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'update' | null>(
    null
  );
  const [itemToEdit, setItemToEdit] = useState<T | null>(null);

  const openCreateMode = () => {
    setDrawerMode('create');
    setItemToEdit(null);
    open();
  };

  const openUpdateMode = (item: T) => {
    setDrawerMode('update');
    setItemToEdit(item);
    open();
  };

  return {
    opened,
    close,
    drawerMode,
    itemToEdit,
    openCreateMode,
    openUpdateMode,
  };
}
