import Logger from '../src/FateLogger.js'

// Basic Logger Example
const basicExample = async (LOGGER_LOCATION) => {
	console.log('--- Basic Logger Example ---')

	// Create logger with default daily log files
	const logger = new Logger(LOGGER_LOCATION)

	// Log some messages
	await logger.log('Application started')
	await logger.log('User logged in: john@example.com')
	await logger.log('Database connection established')
	await logger.log('Error: Failed to process payment', { orderId: '12345' })

	console.log('Basic logs written to logs/ directory')
}

// Advanced Example with Timestamped Messages
const advancedExample = async (LOGGER_LOCATION) => {
	console.log('\n--- Advanced Logger Example ---')

	// Logger with hourly log files
	const hourlyLogger = new Logger(LOGGER_LOCATION, () => {
		const now = new Date()
		const year = now.getFullYear()
		const month = String(now.getMonth() + 1).padStart(2, '0')
		const day = String(now.getDate()).padStart(2, '0')
		const hour = String(now.getHours()).padStart(2, '0')
		return `${year}-${month}-${day}_${hour}h.log`
	})

	// Helper function to create timestamped messages
	const logWithTimestamp = async (message, level = 'INFO') => {
		const timestamp = new Date().toISOString()
		await hourlyLogger.log(`[${timestamp}] [${level}] ${message}`)
	}

	// Log messages with different levels
	await logWithTimestamp('Application initialized', 'INFO')
	await logWithTimestamp('Warning: High memory usage detected', 'WARN')
	await logWithTimestamp('Error: Database connection failed', 'ERROR')
	await logWithTimestamp('Debug: Processing user request', 'DEBUG')

	console.log('Timestamped logs written to logs/hourly/ directory')
}

// Run all examples
export const examples = async (LOGGER_LOCATION) => {
	try {
		await basicExample(`${LOGGER_LOCATION}/basic`)
		await advancedExample(`${LOGGER_LOCATION}/advanced`)
		console.log('\n✅ All logger examples completed successfully!')
	} catch (error) {
		console.error('❌ Error running examples:', error)
	}
}
