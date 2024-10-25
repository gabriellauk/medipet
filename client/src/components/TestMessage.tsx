import { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useApi } from '../contexts/ApiProvider';

export default function TestMessage() {
  const [testData, setTestData] = useState();
  const api = useApi()

  useEffect(() => {
    (async () => {
        const response = await api.get('/test');
        if (response.ok) {
            setTestData(response.body.name);
        }
        else {
            setTestData(null);
        }
    })();
    }, [api]);

  return (
    <>
        {testData === undefined ? 
            <Spinner animation="border" />
            :
                <>
                {testData === null ?
                    <p>Could not retrieve test data</p>
                :
                <>
                    <h1>Test data: {testData}</h1>
                </>
            }
        </>
        }
    </>
  );
}