import { ThemeIcon, Title } from '@mantine/core';
import { IconPawFilled } from '@tabler/icons-react';

function Logo() {
  return (
    <>
      <Title order={1}>
        <ThemeIcon>
          <IconPawFilled />
        </ThemeIcon>{' '}
        MediPet
      </Title>
    </>
  );
}

export default Logo;
