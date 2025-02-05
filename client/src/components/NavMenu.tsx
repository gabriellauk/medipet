import { NavLink as MantineNavLink } from '@mantine/core';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { IconHome2 } from '@tabler/icons-react';

export default function NavMenu() {
  return (
    <>
      <MantineNavLink
        component={RouterNavLink}
        to="/"
        label="Home"
        leftSection={<IconHome2 size={16} stroke={1.5} />}
      />

      <MantineNavLink
        component={RouterNavLink}
        to="/test"
        label="Test Page"
        leftSection={<IconHome2 size={16} stroke={1.5} />}
      />

      <MantineNavLink
        component={RouterNavLink}
        to="/test-protected"
        label="Test Protected"
        leftSection={<IconHome2 size={16} stroke={1.5} />}
      />

      <MantineNavLink
        component={RouterNavLink}
        to="/add-a-pet"
        label="Add a Pet"
        leftSection={<IconHome2 size={16} stroke={1.5} />}
      />
    </>
  );
}
