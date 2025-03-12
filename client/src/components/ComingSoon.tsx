import { Container } from '@mantine/core';

export default function ComingSoon({ title }: { title: string }) {
  return (
    <Container>
      <h1>{title}</h1>
      <p>This feature is coming soon...</p>
    </Container>
  );
}
