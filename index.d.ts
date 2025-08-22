// Type definitions for fatedb
// Project: https://github.com/fatedeath/fatedb
// Definitions by: fatedeath

declare module 'fatedb' {
	// Base World class
	class World {
		location: string
		constructor(location: string)
	}

	// Kingdom class - manages cities
	export class Kingdom extends World {
		cities: Record<string, City>
		constructor(location: string)
		createCity(name: string): City
		getCity(name: string): City
		destoryCity(name: string | { name: string }): void
	}

	// City class - manages people
	export class City extends World {
		name: string
		people: Record<string, Person>
		kingdom: Kingdom
		constructor(location: string, name: string, kingdom: Kingdom)
		createPerson(name: string): Person
		getPerson(name: string): Person
		killPerson(name: string | { name: string }): void
		getKingdom(): Kingdom
	}

	// Person class - manages attributes
	export class Person extends World {
		name: string
		city: City
		attributes: Record<string, any> | undefined
		constructor(location: string, name: string, city: City)
		setAttribute(name: string, value: any): void
		setAttributes(attributes: Record<string, any>): void
		getAttribute(name: string): any
		getAttributes(): Record<string, any>
		getCity(): City
	}
}

declare module 'fatedb/logger' {
	export default class Logger {
		location: string
		currentLogFile: string | undefined
		logFileNameLogic: ((...params: any[]) => string | null) | undefined

		constructor(location: string, logFileNameLogic?: (...params: any[]) => string | null)
		log(message: string, ...params: any[]): Promise<void>
	}
}

declare module 'fatedb/storage' {
	class World {
		location: string
		constructor(location: string)
	}

	export class Storage extends World {
		tables: Record<string, Table>
		constructor(location: string)
		createTable(name: string): Table
		getTable(name: string): Table
		removeTable(name: string): void
	}

	export class Table extends World {
		lines: Record<string, Line>
		constructor(location: string, name: string, storage: Storage)
		createLine(name: string): Line
		getLine(name: string): Line
		removeLine(name: string): void
	}

	export class Line extends World {
		data: Record<string, any> | undefined
		constructor(location: string, name: string, table: Table)
		getData(): Record<string, any>
		getData(name: string): any
		setData(data: Record<string, any>): void
	}
}
