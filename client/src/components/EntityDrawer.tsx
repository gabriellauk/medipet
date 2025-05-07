import { Drawer } from '@mantine/core';
import { ReactNode } from 'react';

export default function EntityDrawer({
  opened,
  onClose,
  children,
}: {
  opened: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      closeButtonProps={{ 'aria-label': 'Close drawer' }}
    >
      {children}
    </Drawer>
  );
}
