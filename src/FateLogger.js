import fs from 'fs'
import path from 'path'

const defaultLogFileNameLogic = () => {
	let date = new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000
	return new Date(date).toISOString().slice(0, 10) + '.log'
}

export default class Logger {
	location
	currentLogFile

	logFileNameLogic

	constructor(location, logFileNameLogic) {
		this.location = location
		this.logFileNameLogic = logFileNameLogic

		if (!fs.existsSync(location)) {
			fs.mkdirSync(location, { recursive: true })
		}
	}

	log(message, ...params) {
		let logFileName
		if (typeof this.logFileNameLogic === 'function') {
			logFileName = this.logFileNameLogic(...params)
			if (logFileName == null) return console.error('log file creation failed with params:', params)
		} else {
			logFileName = defaultLogFileNameLogic()
		}
		let logFilePath = this.location + path.sep + logFileName
		if (this.currentLogFile !== logFilePath) {
			this.currentLogFile = logFilePath
			if (!fs.existsSync(this.currentLogFile)) {
				fs.writeFileSync(this.currentLogFile, '')
			}
		}

		return fs.promises.appendFile(this.currentLogFile, message + '\n')
	}
}
