import { ThemeIcon, Title } from '@mantine/core';
import { IconPawFilled } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import ROUTES from '../../../routes';

function Logo() {
  return (
    <Link to={ROUTES.ROOT} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Title order={1}>
        <ThemeIcon>
          <IconPawFilled />
        </ThemeIcon>{' '}
        MediPet
      </Title>
    </Link>
  );
}

export default Logo;
