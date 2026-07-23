import { Button, Container, Stack, Text, Title } from '@mantine/core';

// The public landing page is intentionally request-time SSR; future CMS content
// can be added with an explicit revalidate policy instead of changing this implicitly.
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <Container size="lg" py={{ base: 'xl', sm: 80 }}>
      <Stack gap="md" maw={720}>
        <Title order={1}>Грузовые перевозки, которым можно доверять</Title>
        <Text size="lg" c="dimmed">Седьмой Транс организует надёжную доставку грузов и помогает бизнесу планировать логистику.</Text>
        <Button component="a" href="/quote" w="fit-content">Оставить заявку</Button>
      </Stack>
    </Container>
  );
}
