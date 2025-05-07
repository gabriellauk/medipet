import { Loader, Button } from '@mantine/core';

interface EntityListProps<T> {
  name: string;
  entities: T[];
  loading: boolean;
  error: string | null;
  emptyMessage: string;
  onAdd: () => void;
  renderEntity: (entity: T) => JSX.Element;
}

export function EntityList<T>({
  name,
  entities,
  loading,
  error,
  emptyMessage,
  onAdd,
  renderEntity,
}: EntityListProps<T>) {
  const renderAddButton = () => (
    <Button onClick={onAdd} radius="xl" mb="xl" size="md">
      Add {name}
    </Button>
  );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <>
        <p>
          <i>{error}</i>
        </p>
        {renderAddButton()}
      </>
    );
  }

  if (entities.length === 0) {
    return (
      <>
        <p>
          <i>{emptyMessage}</i>
        </p>
        {renderAddButton()}
      </>
    );
  }

  return (
    <>
      {renderAddButton()}
      {entities.map(renderEntity)}
    </>
  );
}
