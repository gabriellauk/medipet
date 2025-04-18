import { Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

export default function DemoDisclaimer() {
  const icon = <IconInfoCircle />;

  return (
    <Alert
      variant="filled"
      color="blue"
      title="You're viewing a demo account."
      icon={icon}
    >
      To set up your own account, start by signing in with your Google login.
    </Alert>
  );
}
