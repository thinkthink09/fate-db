import { Storage } from '../src/FateDB.js'

// Basic Usage Example
export const example = (FILE_SYSTEM_LOCATION) => {
	// Initialize storage
	const storage = new Storage(FILE_SYSTEM_LOCATION)

	// Create a table
	const userTable = storage.createTable('users')

	// Create a data line
	const user1 = userTable.createLine('user_001')

	// Set data
	user1.setData({
		id: 1,
		name: 'John Doe',
		email: 'john@example.com',
		createdAt: new Date().toISOString()
	})

	// Retrieve specific data
	console.log('User name:', user1.getData('name'))

	// Retrieve all data
	console.log('Full user data:', user1.data)

	// Get existing table and line
	const existingUser = storage.getTable('users').getLine('user_001')
	console.log('Retrieved user:', existingUser.data)
}
