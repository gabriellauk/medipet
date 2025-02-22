import { useState, useEffect } from 'react';
import { Loader } from '@mantine/core';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';

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

  const { state } = useAuth();

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
              <h2>
                <p>
                  Hello {state.user?.firstName} {state.user?.lastName}
                </p>
              </h2>
            </>
          )}
        </>
      )}
    </>
  );
}
