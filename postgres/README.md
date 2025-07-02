# OrioleDB Docker Extension

OrioleDB is a storage extension for PostgreSQL that eliminates the overhead of buffer mapping and provides lock-less page reading. It's designed for modern hardware and cloud infrastructure, offering better performance and simplified maintenance compared to traditional database systems.

## Features

- Simple connection interface to OrioleDB
- Execute SQL queries directly from Docker Desktop
- Connection status monitoring
- Clean, minimal UI focused on essential database operations

## Getting Started

## Installing the Extension

```
make install-extension
```

## Using the Extension

1. Start the OrioleDB service using the extension
2. Check connection status with the "Check Connection" button
3. Execute SQL queries using the query interface
4. View results in the response area

## Development

### Hot Reloading

During UI development, you can use hot reloading to test changes without rebuilding the entire extension:

1. Start the development server:
```shell
cd ui
npm run dev
```

2. Configure Docker Desktop to use the development server:
```shell
docker extension dev ui-source orioledb-docker-extension http://localhost:5173
```

3. Close and reopen Docker Desktop dashboard to see your changes instantly

4. When finished, reset the extension configuration:
```shell
docker extension dev reset orioledb-docker-extension
```

### Debugging

To enable Chrome Dev Tools for debugging the extension UI:

```shell
docker extension dev debug orioledb-docker-extension
```

Each subsequent click on the extension tab will open Chrome Dev Tools. This allows you to:
- View console errors and logs
- Inspect React components and state
- Monitor network requests to postgres-meta
- Debug styling and layout issues

To disable debugging mode:

```shell
docker extension dev reset orioledb-docker-extension
```

## About OrioleDB

OrioleDB is a modern storage engine for PostgreSQL featuring:
- MVCC based on UNDO log concept
- Copy-on-write checkpoints
- Row-level write-ahead logging (WAL)
- Optimized for multi-core servers
- Eliminates dedicated garbage collection overhead

