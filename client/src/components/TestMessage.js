import { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export default function TestMessage() {
  const [testData, setTestData] = useState();

  useEffect(() => {
    (async () => {
        const response = await fetch(BASE_API_URL + '/test');
        if (response.ok) {
        const results = await response.json();
        setTestData(results.name);
        }
        else {
        setTestData(null);
        }
    })();
    }, []);

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