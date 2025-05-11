import { MantineProvider } from '@mantine/core';
import ApiContextProvider from './ApiContextProvider';
import AuthContextProvider from './AuthContextProvider';
import AnimalsContextProvider from './AnimalsContextProvider';

export default function Providers({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <MantineProvider>
      <ApiContextProvider>
        <AuthContextProvider>
          <AnimalsContextProvider>{children}</AnimalsContextProvider>
        </AuthContextProvider>
      </ApiContextProvider>
    </MantineProvider>
  );
}
