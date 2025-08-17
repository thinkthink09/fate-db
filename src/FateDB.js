import fs from 'fs'
import path from 'path'

const FORMAT_JSON = true

class World {
	location

	constructor(location) {
		this.location = location
	}
}

export class Kingdom extends World {
	cities = {}

	constructor(location) {
		super(location)
		if (!fs.existsSync(location)) {
			fs.mkdirSync(location, { recursive: true })
		}
		fs.readdirSync(location, { withFileTypes: true }).map(
			({ name }) => (this.cities[name] = new Table(this.location + path.sep + name, name, this))
		)
	}

	createCity(name) {
		let cityLocation = this.location + path.sep + name
		if (fs.existsSync(cityLocation)) {
			console.warn(`city ${name} already exists`)
		} else {
			fs.mkdirSync(cityLocation)
		}
		let city = new Table(cityLocation, name, this)
		this.cities[name] = city
		return city
	}

	getCity(name) {
		if (this.cities[name]) return this.cities[name]
		return this.createCity(name)
	}

	destoryCity(name) {
		try {
			typeof name === 'string'
				? fs.rmSync(this.cities[name].location, {
						recursive: true,
						force: true
				  })
				: fs.rmSync(this.cities[name.name].location, {
						recursive: true,
						force: true
				  })
		} catch (e) {
			console.warn('destory city failed')
		}
	}
}

export class City extends World {
	name
	people = {}
	kingdom

	constructor(location, name, kingdom) {
		super(location)
		this.name = name
		this.kingdom = kingdom
		fs.readdirSync(location, { withFileTypes: true }).map(
			({ name }) => (this.people[name] = new Person(this.location + path.sep + name, name, this))
		)
	}

	createPerson(name) {
		let personHouse = this.location + path.sep + name
		if (fs.existsSync(personHouse)) {
			console.warn(`person ${name} already exists`)
		} else {
			fs.writeFileSync(personHouse, '')
		}
		let person = new Person(personHouse, name, this)
		this.people[name] = person
		return person
	}

	getPerson(name) {
		if (this.people[name]) return this.people[name]
		return this.createPerson(name)
	}

	killPerson(name) {
		try {
			typeof name === 'string'
				? fs.rmSync(this.people[name].location, { force: true })
				: fs.rmSync(this.people[name.name].location, { force: true })
		} catch (e) {
			console.warn('killing person failed')
		}
	}

	getKingdom() {
		return this.kingdom
	}
}

export class Person extends World {
	name
	city
	attributes

	constructor(location, name, city) {
		super(location)
		this.name = name
		this.city = city
	}

	setAttribute(name, value) {
		if (!this.attributes) {
			this.#loadAttribute()
		}
		this.attributes = {
			...this.attributes,
			[name]: value
		}
		fs.writeFileSync(this.location, JSON.stringify(this.attributes, null, FORMAT_JSON ? '\t' : null))
	}

	setAttributes(attributes) {
		this.attributes = attributes
		fs.writeFileSync(this.location, JSON.stringify(this.attributes, null, FORMAT_JSON ? '\t' : null))
	}

	getAttribute(name) {
		if (!this.attributes) {
			this.#loadAttribute()
		}
		return this.attributes[name]
	}

	getAttributes() {
		if (!this.attributes) {
			this.#loadAttribute()
		}
		return this.attributes
	}

	getCity() {
		return this.city
	}

	#loadAttribute() {
		try {
			let raw = fs.readFileSync(this.location, { encoding: 'utf8' })
			if (raw.length) {
				this.attributes = JSON.parse(raw)
			} else {
				this.attributes = {}
			}
		} catch (e) {
			console.warn('fail to load person attributes')
		}
	}
}

// naming overloads to make this look more professional

export class Storage extends Kingdom {
	tables
	constructor(location) {
		super(location)
		this.tables = this.cities
	}
	createTable(name) {
		return this.createCity(name)
	}
	getTable(name) {
		return this.getCity(name)
	}
	removeTable(name) {
		this.destoryCity(name)
	}
}

export class Table extends City {
	createLine(name) {
		return this.createPerson(name)
	}
	getLine(name) {
		return this.getPerson(name)
	}
	removeLine(name) {
		this.killPerson(name)
	}
}

export class Line extends Person {
	getData(name) {
		if (typeof name !== 'undefined') {
			return this.getAttribute(name)
		}
		return this.getAttributes()
	}
	setData(data) {
		this.setAttributes(data)
	}
}

// examples

// const test = () => {
// 	let appStorage = new Kingdom('db\\app')
// 	let sampleTable = appStorage.createCity('tableName')
// 	let sampleData = sampleTable.createPerson('item1')
// 	sampleData.setAttributes({
// 		id: 1,
// 		name: 'item 1',
// 	})
// 	console.log(appStorage.getCity('tableName').getPerson('item1').getAttributes())
// }
