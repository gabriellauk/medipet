import { useState, useEffect } from 'react';
import { Loader } from '@mantine/core';
import { useApi } from '../contexts/ApiContext';

export default function TestMessage() {
  const [testData, setTestData] = useState<string | null>();
  const api = useApi();

  useEffect(() => {
    (async () => {
      const response = await api.get('/test');
      if (response.ok) {
        setTestData(response.body.name);
      } else {
        setTestData(null);
      }
    })();
  }, [api]);

  return (
    <>
      {testData === undefined ? (
        <Loader color="blue" />
      ) : (
        <>
          {testData === null ? (
            <p>Could not retrieve test data</p>
          ) : (
            <>
              <h1>Test data: {testData}</h1>
            </>
          )}
        </>
      )}
    </>
  );
}
