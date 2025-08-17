# FateDB

A file-based database system for those who don't want to go through the burden of DB maintenance.

## Installation

```bash
npm install git+https://github.com/thinkthink09/fatedb
```

(soon to be)

```bash
npm install fatedb
```

## Features

### DB

-   **File-based storage**: No database workbench required
-   **Simple API**: Easy-to-use js interface for data management
-   **Zero dependencies**: Lightweight and fast(maybe)

### Logger

-   **Flexible logging**: File-based logger with customizable file naming

## Quick Start

### Database Operations

```javascript
import { Storage } from 'fatedb'

// Initialize storage
const storage = new Storage('data')

// Create a table
const userTable = storage.createTable('users')

// Create a data line
const user1 = userTable.createLine('user_001')

// Set data
user1.setData({
	id: 1,
	name: 'John Doe',
	email: 'john@example.com'
})

// Retrieve data
console.log(user1.getData('name')) // 'John Doe'
console.log(user1.getData()) // Full user object
```

### Logging

```javascript
import { FateLogger } from 'fatedb'

// Basic logging with daily files
const logger = new FateLogger('logs')
await logger.log('Application started')

// Custom file naming
const categoryLogger = new FateLogger('logs', (category) => {
	return category ? `${category}.log` : null
})

await categoryLogger.log('User logged in', 'auth')
await categoryLogger.log('Payment processed', 'payments')
```

## API Reference

### Storage

-   `new Storage(location)` - Create storage instance
-   `createTable(name)` - Create a new table
-   `getTable(name)` - Get existing table or create if not exists
-   `removeTable(name)` - Delete a table

### Table

-   `createLine(name)` - Create a new data line
-   `getLine(name)` - Get existing line or create if not exists
-   `removeLine(name)` - Delete a line
-   `lines` - Access all lines in the table

### Line

-   `setData(data)` - Set line data
-   `getData(key?)` - Get specific field or all data
-   `data` - Direct access to line data

### FateLogger

-   `new FateLogger(location, nameLogic?)` - Create logger instance
-   `log(message, ...params)` - Log a message

## Examples

Check the `samples/` directory for complete examples:

-   `samples/db-usage.js` - Database operations
-   `samples/logger-usage.js` - Logging examples

## Requirements

-   Node.js >= 14.0.0
-   ES modules support

## License

MIT
