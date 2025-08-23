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
		cities: Map<string, City>
		constructor(location: string)
		createCity(name: string): City
		hasCity(name: string): boolean
		getCity(name: string): City
		destoryCity(name: string | { name: string }): void
	}

	// City class - manages people
	export class City extends World {
		name: string
		people: Map<string, Person>
		kingdom: Kingdom
		constructor(location: string, name: string, kingdom: Kingdom)
		createPerson(name: string): Person
		hasPerson(name: string): boolean
		getPerson(name: string): Person
		killPerson(name: string | { name: string }): void
		getKingdom(): Kingdom
	}

	// Person class - manages attributes
	export class Person extends World {
		name: string
		city: City
		attributes: Map<string, any> | undefined
		constructor(location: string, name: string, city: City)
		setAttribute(name: string, value: any): void
		setAttributes(attributes: Map<string, any>): void
		getAttribute(name: string): any
		getAttributes(): Map<string, any>
		getCity(): City
	}

	export class Storage extends World {
		tables: Map<string, Table>
		constructor(location: string)
		createTable(name: string): Table
		hasTable(name: string): boolean
		getTable(name: string): Table
		removeTable(name: string): void
	}

	export class Table extends World {
		lines: Map<string, Line>
		constructor(location: string, name: string, storage: Storage)
		createLine(name: string): Line
		hasLine(name: string): boolean
		getLine(name: string): Line
		removeLine(name: string): void
	}

	export class Line extends World {
		data: Map<string, any> | undefined
		constructor(location: string, name: string, table: Table)
		getData(): Map<string, any>
		getData(name: string): any
		setData(data: Map<string, any>): void
	}

	export class Logger {
		location: string
		currentLogFile: string | undefined
		logFileNameLogic: ((...params: any[]) => string | null) | undefined

		constructor(location: string, logFileNameLogic?: (...params: any[]) => string | null)
		log(message: string, ...params: any[]): Promise<void>
	}
}
