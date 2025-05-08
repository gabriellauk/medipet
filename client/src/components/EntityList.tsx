import { Loader, Button } from '@mantine/core';
import { EntityListProps } from '../types/GenericTypes';

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
