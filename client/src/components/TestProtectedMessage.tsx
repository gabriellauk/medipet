import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiContext';
import { Loader } from '@mantine/core';

export default function TestProtectedMessage() {
  const [testProtectedData, setTestProtectedData] = useState<string | null>();
  const api = useApi();

  useEffect(() => {
    (async () => {
      const response = await api.get('/test-protected');
      if (response.ok) {
        setTestProtectedData(response.body.name);
      } else {
        setTestProtectedData(null);
      }
    })();
  }, [api]);

  return (
    <>
      {testProtectedData === undefined ? (
        <Loader color="blue" />
      ) : (
        <>
          {testProtectedData === null ? (
            <p>Could not retrieve test data</p>
          ) : (
            <>
              <h1>Test data: {testProtectedData}</h1>
            </>
          )}
        </>
      )}
    </>
  );
}
