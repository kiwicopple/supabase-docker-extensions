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

## Debugging

To enable Chrome Dev Tools for debugging the extension UI:

```shell
docker extension dev debug orioledb-docker-extension:1.0
```

Each subsequent click on the extension tab will open Chrome Dev Tools. This allows you to:
- View console errors and logs
- Inspect React components and state
- Monitor network requests to the backend
- Debug styling and layout issues

To disable debugging mode:

```shell
docker extension dev reset orioledb-docker-extension:1.0
```

## About OrioleDB

OrioleDB is a modern storage engine for PostgreSQL featuring:
- MVCC based on UNDO log concept
- Copy-on-write checkpoints
- Row-level write-ahead logging (WAL)
- Optimized for multi-core servers
- Eliminates dedicated garbage collection overhead

