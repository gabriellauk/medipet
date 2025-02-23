import { Text, UnstyledButton } from '@mantine/core';
import { NavLink as RouterNavLink } from 'react-router-dom';
import {
  IconCalendar,
  IconHome2,
  IconLogout,
  IconNotes,
  IconPill,
  IconScaleOutline,
} from '@tabler/icons-react';
import classes from './NavMenu.module.css';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAnimals } from '../contexts/AnimalsContext';

const options = [
  { link: '/', label: 'Home', icon: IconHome2 },
  { link: '/test', label: 'Weight Tracker', icon: IconScaleOutline },
  { link: '/test-protected', label: 'Medication Schedule', icon: IconPill },
  { link: '/test', label: 'Appointments Calendar', icon: IconCalendar },
  {
    link: '/observation-diary',
    label: 'Observations Diary',
    icon: IconNotes,
  },
];

export default function NavMenu() {
  const [active, setActive] = useState('Home');
  const { logout } = useAuth();
  const { animals } = useAnimals();

  const links = options.map((item) => (
    <RouterNavLink
      className={classes.link}
      data-active={item.label === active || undefined}
      to={item.link}
      key={item.label}
      onClick={() => {
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </RouterNavLink>
  ));

  return (
    <>
      <Text fw={500} size="sm" className={classes.title} c="dimmed" mb="xs">
        {animals[0].name}'s Medical Record
      </Text>
      <div className={classes.navbarMain}>{links}</div>
      <div className={classes.footer}>
        <a href="#" className={classes.link}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <form onSubmit={logout}>
            <UnstyledButton type="submit">Logout</UnstyledButton>
          </form>
        </a>
      </div>
    </>
  );
}
