import React from "react";
import Button from "@mui/material/Button";
import { createDockerDesktopClient } from "@docker/extension-api-client";
import {
  Stack,
  TextField,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Link,
} from "@mui/material";
import { OpenInNew as OpenInNewIcon } from "@mui/icons-material";

const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const [queryResult, setQueryResult] = React.useState<string>("");
  const [query, setQuery] = React.useState<string>("SELECT version();");
  const ddClient = useDockerDesktopClient();

  const executeQuery = async () => {
    console.log("Executing query:", query);
    try {
      const response = await fetch("http://localhost:8080/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Query result:", data);
        setQueryResult(JSON.stringify(data, null, 2));
      } else {
        const errorText = await response.text();
        throw new Error(
          `Query failed with status ${response.status}: ${errorText}`
        );
      }
    } catch (error) {
      console.error("Query execution failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      setQueryResult(`Error: ${errorMessage}`);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, px: 0, mx: 0 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            OrioleDB Management
          </Typography>
          <Link
            href="https://www.orioledb.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <IconButton color="inherit" size="small">
              <OpenInNewIcon fontSize="small" />
            </IconButton>
            Docs
          </Link>
        </Toolbar>
      </AppBar>

      <Box>
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
    </Box>
  );
}
