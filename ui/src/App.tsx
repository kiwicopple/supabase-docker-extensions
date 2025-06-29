import React from 'react'
import Button from '@mui/material/Button'
import {
  Stack,
  TextField,
  Typography,
  Box,
  Alert,
  Divider,
} from '@mui/material'
import { Dataset as DatabaseIcon } from '@mui/icons-material'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import { AppProvider } from '@toolpad/core/AppProvider'
import type { Navigation, Branding } from '@toolpad/core'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

const NAVIGATION: Navigation = [
  {
    segment: 'queries',
    title: 'SQL Queries',
    icon: <DatabaseIcon />,
  },
]

const BRANDING: Branding = {
  title: 'Postgres by Supabase',
}

function QueryPage() {
  const [queryResult, setQueryResult] = React.useState<any[]>([])
  const [queryError, setQueryError] = React.useState<string>('')
  const [columns, setColumns] = React.useState<GridColDef[]>([])

  // Keep this query as a constant for now.
  const [query, setQuery] = React.useState<string>(
    'select * from pg_available_extensions;'
  )

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
        overflow: 'hidden',
      }}
    >
      <Box sx={{ flex: '1 1 auto', minHeight: 0 }}>
        {queryResult.length > 0 ? (
          <DataGrid
            rows={queryResult}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            disableColumnMenu
            sx={{
              height: '100%',
              border: 'none',
              fontFamily: '"IBM Plex Mono", monospace',
              '& .MuiDataGrid-main': {
                border: 'none',
              },
              '& .MuiDataGrid-cell': {
                fontFamily: '"IBM Plex Mono", monospace',
              },
              '& .MuiDataGrid-columnHeader': {
                fontFamily: '"IBM Plex Mono", monospace',
              },
              '& .MuiDataGrid-columnHeaders': {
                fontFamily: '"IBM Plex Mono", monospace',
              },
              '& .MuiDataGrid-footerContainer': {
                fontFamily: '"IBM Plex Mono", monospace',
              },
            }}
          />
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
            }}
          >
            <Typography variant="h6">Run a query to see results.</Typography>
          </Box>
        )}
      </Box>

      <Stack
        spacing={0}
        sx={{
          flex: '0 0 auto',
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'background.default',
          zIndex: 1000,
        }}
      >
        {queryError && (
          <Alert
            severity="error"
            sx={{
              fontFamily: '"IBM Plex Mono", monospace',
              mx: 1,
              mb: 2,
            }}
          >
            {queryError}
          </Alert>
        )}

        <Divider />

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
            fontFamily: '"IBM Plex Mono", monospace !important',
            '& .MuiOutlinedInput-root': {
              fontFamily: '"IBM Plex Mono", monospace !important',
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
            '& .MuiInputBase-input': {
              fontFamily: '"IBM Plex Mono", monospace !important',
            },
            '& textarea': {
              fontFamily: '"IBM Plex Mono", monospace !important',
            },
          }}
        />
        <Button
          variant="contained"
          onClick={executeQuery}
          sx={{ borderRadius: 0, py: 1.5 }}
        >
          Execute Query
        </Button>
      </Stack>
    </Box>
  )
}

export function App() {
  return (
    <AppProvider branding={BRANDING}>
      <DashboardLayout
        disableCollapsibleSidebar
        hideNavigation
        sx={{
          '& .MuiDrawer-root': {
            display: 'none',
          },
          '& .MuiAppBar-root a': {
            pointerEvents: 'none',
            cursor: 'default',
          },
        }}
      >
        <QueryPage />
      </DashboardLayout>
    </AppProvider>
  )
}
