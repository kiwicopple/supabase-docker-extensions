import React from 'react'
import Button from '@mui/material/Button'
import { Stack, TextField, Typography, Box, Alert } from '@mui/material'
import { Dataset as DatabaseIcon } from '@mui/icons-material'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import { AppProvider } from '@toolpad/core/AppProvider'
import type { Navigation, Branding } from '@toolpad/core'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Divider from '@mui/material/Divider'

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
  const [queryResult, setQueryResult] = React.useState<any[]>([])
  const [queryError, setQueryError] = React.useState<string>('')
  const [columns, setColumns] = React.useState<GridColDef[]>([])
  const [query, setQuery] = React.useState<string>('SELECT version();')

  const executeQuery = async () => {
    console.log('Executing query:', query)
    setQueryError('')
    setQueryResult([])
    setColumns([])

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

        if (Array.isArray(data) && data.length > 0) {
          // Generate columns from the first row
          const firstRow = data[0]
          const generatedColumns: GridColDef[] = Object.keys(firstRow).map(
            (key) => ({
              field: key,
              headerName: key.charAt(0).toUpperCase() + key.slice(1),
              width: 150,
              flex: 1,
            })
          )

          // Add row IDs for DataGrid
          const rowsWithIds = data.map((row, index) => ({
            id: row.id || index,
            ...row,
          }))

          setColumns(generatedColumns)
          setQueryResult(rowsWithIds)
        } else {
          setQueryError('No data returned from query')
        }
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
      setQueryError(errorMessage)
    }
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack spacing={0} sx={{ flex: '0 0 auto' }}>
        <TextField
          multiline
          minRows={2}
          maxRows={10}
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault()
              executeQuery()
            }
          }}
          placeholder="Enter your SQL query here... (Cmd/Ctrl + Enter to execute)"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: 'none',
              },
              '&:hover fieldset': {
                border: 'none',
              },
              '&.Mui-focused fieldset': {
                border: 'none',
              },
            },
          }}
        />
        <Button 
          variant="contained" 
          onClick={executeQuery}
          sx={{ borderRadius: 0 }}
        >
          Execute Query
        </Button>

        {queryError && <Alert severity="error">{queryError}</Alert>}
      </Stack>

      {queryResult.length > 0 && (
        <>
          <Divider sx={{ mt: 2 }} />
          <Box sx={{ flex: '1 1 auto' }}>
            <DataGrid
              rows={queryResult}
              columns={columns}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-main': {
                  border: 'none',
                },
              }}
            />
          </Box>
        </>
      )}
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
