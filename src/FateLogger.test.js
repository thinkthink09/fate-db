import fs from 'fs'
import path from 'path'
import Logger from './FateLogger.js'
import { examples } from '../samples/logger-usage.js'

describe('Logger', () => {
	const loggerLocation = 'logs-unit-test'
	const sampleLocation = 'logs-sample-test'

	beforeAll(() => {
		if (fs.existsSync(loggerLocation)) fs.rmSync(loggerLocation, { recursive: true, force: true })
		if (fs.existsSync(sampleLocation)) fs.rmSync(sampleLocation, { recursive: true, force: true })
	})

	it('should create log files under logs with today date', async () => {
		expect(fs.existsSync(loggerLocation)).toBe(false)

		let logger = new Logger(loggerLocation)
		// logger should not create a new file to log, yet
		expect(fs.readdirSync(loggerLocation).length).toBe(0)

		// test logging, it should create a file
		let testLog = 'Here are some logs'
		await logger.log(testLog)
		expect(fs.readdirSync(loggerLocation).length).toBe(1)

		let logger2 = new Logger(loggerLocation)
		await logger2.log('some more random log')
		// new logger should not create a new file
		expect(fs.readdirSync(loggerLocation).length).toBe(1)

		expect(fs.readFileSync(logger.currentLogFile, { encoding: 'utf8' })).toContain(testLog)

		// logger2 should be the same thing
		expect(fs.readFileSync(logger2.currentLogFile, { encoding: 'utf8' })).toBe(
			fs.readFileSync(logger.currentLogFile, { encoding: 'utf8' })
		)

		// test overloading
		console.error = (message) => {
			return logger.log(message)
		}
		let testLog2 = 'This log is fine'
		await console.error(testLog2)

		// log file should contain both logs
		expect(fs.readFileSync(logger.currentLogFile, { encoding: 'utf8' })).toContain(testLog)
		expect(fs.readFileSync(logger.currentLogFile, { encoding: 'utf8' })).toContain(testLog2)
	})

	it('should be able to customize log file naming logic', async () => {
		expect(fs.existsSync(loggerLocation)).toBe(false)

		let customLogger = new Logger(loggerLocation, (filename) => (filename ? filename + '.log' : null))
		// custom logger should not create a new file
		expect(fs.readdirSync(loggerLocation).length).toBe(0)

		let testLog = 'some logs for file name custom.log'
		await customLogger.log(testLog, 'custom')

		// custom logger should create a new file called custom.log
		expect(fs.readdirSync(loggerLocation)).toStrictEqual(expect.arrayContaining(['custom.log']))

		expect(fs.readFileSync(customLogger.currentLogFile, { encoding: 'utf8' })).toContain(testLog)

		// create a second log file and log
		await customLogger.log(testLog, 'custom2')
		// custom logger should create a new file called custom2.log
		expect(fs.readdirSync(loggerLocation)).toStrictEqual(expect.arrayContaining(['custom.log', 'custom2.log']))

		// log on custom.log again
		await customLogger.log(testLog, 'custom')
		// should not create a new file
		expect(fs.readdirSync(loggerLocation)).toStrictEqual(expect.arrayContaining(['custom.log', 'custom2.log']))
		// custom logs should be longer than custom2
		expect(fs.readFileSync(loggerLocation + path.sep + 'custom.log', { encoding: 'utf8' }).length).toBeGreaterThan(
			fs.readFileSync(loggerLocation + path.sep + 'custom2.log', { encoding: 'utf8' }).length
		)

		// test failing to meet custom logFileName logic
		let notSupposeToLog = 'this is going to fail'
		await customLogger.log(notSupposeToLog)

		// should create new error log
		expect(fs.readdirSync(loggerLocation).length).toBe(3)

		// find error log file and check contents
		fs.readdirSync(loggerLocation).map((logFile) => {
			if (logFile.includes('custom')) return
			expect(fs.readFileSync(loggerLocation + path.sep + logFile, { encoding: 'utf8' })).toContain(
				'log file creation failed'
			)
		})

		//current file should still be custom.log, and it's not suppose to log anything new
		expect(customLogger.currentLogFile).toBe(loggerLocation + path.sep + 'custom.log')
		expect(fs.readFileSync(customLogger.currentLogFile, { encoding: 'utf8' })).not.toContain(notSupposeToLog)
	})

	test('sample code should run without errors', async () => {
		// Run the examples
		await expect(examples(sampleLocation)).resolves.not.toThrow()

		// Validate that log directories and files were created
		expect(fs.existsSync(`${sampleLocation}/basic`)).toBe(true)
		expect(fs.existsSync(`${sampleLocation}/advanced`)).toBe(true)

		// Check that some log files were created
		expect(fs.readdirSync(`${sampleLocation}/basic`).length).toBeGreaterThan(0)
		expect(fs.readdirSync(`${sampleLocation}/advanced`).length).toBeGreaterThan(0)
	})

	afterEach(() => {
		// teardown unit test logger dir
		if (fs.existsSync(loggerLocation)) fs.rmSync(loggerLocation, { recursive: true, force: true })
		if (fs.existsSync(sampleLocation)) fs.rmSync(sampleLocation, { recursive: true, force: true })
	})
})
