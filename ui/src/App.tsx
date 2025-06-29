import React from 'react'
import Button from '@mui/material/Button'
import { Stack, TextField, Typography, Box } from '@mui/material'
import { Dataset as DatabaseIcon } from '@mui/icons-material'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import { AppProvider } from '@toolpad/core/AppProvider'
import type { Navigation, Branding } from '@toolpad/core'

const NAVIGATION: Navigation = [
  {
    segment: 'queries',
    title: 'SQL Queries',
    icon: <DatabaseIcon />,
  },
]

const BRANDING: Branding = {
  title: 'OrioleDB Management',
}

function QueryPage() {
  const [queryResult, setQueryResult] = React.useState<string>('')
  const [query, setQuery] = React.useState<string>('SELECT version()')

  const executeQuery = async () => {
    console.log('Executing query:', query)
    try {
      const response = await fetch('http://localhost:8080/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Query result:', data)
        setQueryResult(JSON.stringify(data, null, 2))
      } else {
        const errorText = await response.text()
        throw new Error(
          `Query failed with status ${response.status}: ${errorText}`
        )
      }
    } catch (error) {
      console.error('Query execution failed:', error)
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error)
      setQueryResult(`Error: ${errorMessage}`)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your OrioleDB instance with this simple interface.
      </Typography>

      <Stack spacing={3}>
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
            <Button variant="contained" onClick={executeQuery}>
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
  )
}

export function App() {
  return (
    <AppProvider navigation={NAVIGATION} branding={BRANDING}>
      <DashboardLayout>
        <QueryPage />
      </DashboardLayout>
    </AppProvider>
  )
}
