import React from 'react';
import Button from '@mui/material/Button';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Stack, TextField, Typography, Box, Chip } from '@mui/material';

const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const [connectionStatus, setConnectionStatus] = React.useState<string>('Not connected');
  const [queryResult, setQueryResult] = React.useState<string>('');
  const [query, setQuery] = React.useState<string>('SELECT version();');
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const ddClient = useDockerDesktopClient();

  const checkConnection = async () => {
    console.log('Checking connection to postgres-meta...');
    try {
      const response = await fetch('http://localhost:8080/health');
      console.log('Health check response:', response);
      
      if (response.ok) {
        // Also test with a simple query
        const queryResponse = await fetch('http://localhost:8080/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: 'SELECT version();' }),
        });
        
        if (queryResponse.ok) {
          const data = await queryResponse.json();
          console.log('Version query result:', data);
          setConnectionStatus('Connected to OrioleDB via postgres-meta');
          setIsConnected(true);
        } else {
          throw new Error(`Query failed with status ${queryResponse.status}`);
        }
      } else {
        throw new Error(`Health check failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      setConnectionStatus(`Connection failed: ${errorMessage}`);
      setIsConnected(false);
    }
  };

  const executeQuery = async () => {
    console.log('Executing query:', query);
    try {
      const response = await fetch('http://localhost:8080/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Query result:', data);
        setQueryResult(JSON.stringify(data, null, 2));
      } else {
        const errorText = await response.text();
        throw new Error(`Query failed with status ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Query execution failed:', error);
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      setQueryResult(`Error: ${errorMessage}`);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        OrioleDB Management
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your OrioleDB instance with this simple interface.
      </Typography>

      <Stack spacing={3}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button variant="contained" onClick={checkConnection}>
              Check Connection
            </Button>
            <Chip 
              label={connectionStatus} 
              color={isConnected ? 'success' : 'error'}
              variant="outlined"
            />
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Execute Query
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="SQL Query"
              multiline
              rows={3}
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your SQL query here..."
            />
            <Button 
              variant="contained" 
              onClick={executeQuery}
              disabled={!isConnected}
            >
              Execute Query
            </Button>
            <TextField
              label="Query Result"
              multiline
              rows={8}
              fullWidth
              value={queryResult}
              disabled
              variant="outlined"
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
