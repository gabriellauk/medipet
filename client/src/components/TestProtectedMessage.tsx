import { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useApi } from '../contexts/ApiProvider';

export default function TestProtectedMessage() {
  const [testProtectedData, setTestProtectedData] = useState();
  const api = useApi()

  useEffect(() => {
    (async () => {
        const response = await api.get('/test-protected');
        if (response.ok) {
            setTestProtectedData(response.body.name);
        }
        else {
            setTestProtectedData(null);
        }
    })();
    }, [api]);

  return (
    <>
        {testProtectedData === undefined ? 
            <Spinner animation="border" />
            :
                <>
                {testProtectedData === null ?
                    <p>Could not retrieve test data</p>
                :
                <>
                    <h1>Test data: {testProtectedData}</h1>
                </>
            }
        </>
        }
    </>
  );
}