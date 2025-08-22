import fs from 'fs'
import path from 'path'
import { jest } from '@jest/globals'
import { Storage, Kingdom } from './FateDB.js'
import { example } from '../samples/db-usage.js'

describe('FateDB Service', () => {
	const testKingdomLocation = `db${path.sep}unit-test`
	const sampleLocation = `db${path.sep}sample-test`

	beforeAll(() => {
		if (fs.existsSync(testKingdomLocation)) fs.rmSync(testKingdomLocation, { recursive: true, force: true })
		if (fs.existsSync(sampleLocation)) fs.rmSync(sampleLocation, { recursive: true, force: true })
	})
	let testKingdom = null

	it('should create DB space if not already created', () => {
		// Kingdom not exist
		expect(fs.existsSync(testKingdomLocation)).toBe(false)
		testKingdom = new Kingdom(testKingdomLocation)
		// Kingdom exists
		expect(fs.existsSync(testKingdomLocation)).toBe(true)
		expect(testKingdom.location).toBe(testKingdomLocation)
	})

	let testCityLocation = null
	let city = null,
		town = null

	it('should be able to create city in the same location, getCity should also create city if not exist', () => {
		// city not exist
		testCityLocation = testKingdomLocation + path.sep + 'test-city'
		expect(fs.existsSync(testCityLocation)).toBe(false)
		expect(Object.keys(testKingdom.cities).length).toBe(0)

		city = testKingdom.createCity('test-city')
		// 1 city exists
		expect(fs.existsSync(testCityLocation)).toBe(true)
		expect(city.location).toBe(testCityLocation)
		expect(city.getKingdom()).toBe(testKingdom)
		expect(Object.keys(testKingdom.cities).length).toBe(1)
		expect(testKingdom.hasCity('test-city')).toBe(true)
		expect(testKingdom.hasCity('other-town')).toBe(false)

		town = testKingdom.getCity('other-town')
		// get city also creates city
		expect(fs.existsSync(testKingdomLocation + path.sep + 'other-town')).toBe(true)
		expect(Object.keys(testKingdom.cities).length).toBe(2)
		expect(town.getKingdom()).toBe(testKingdom)
		// 2 city exists

		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})

		// create same city
		testKingdom.createCity('test-city')
		expect(warn).toHaveBeenCalled()

		// no extra city is being created
		expect(fs.existsSync(testCityLocation)).toBe(true)
		expect(Object.keys(testKingdom.cities).length).toBe(2)
	})

	let testPersonLocation = null
	let cityPerson = null,
		townPerson = null

	it('should be able to create people in the cities', () => {
		testPersonLocation = city.location + path.sep + 'test-person'
		expect(fs.existsSync(testPersonLocation)).toBe(false)
		// fake create person in town
		townPerson = town.createPerson('test-person')
		expect(Object.keys(town.people).length).toBe(1)
		expect(fs.existsSync(testPersonLocation)).toBe(false)

		// create real person in city, get should also create
		cityPerson = city.getPerson('test-person')
		expect(fs.existsSync(testPersonLocation)).toBe(true)
		expect(Object.keys(city.people).length).toBe(1)
		expect(cityPerson.location).toBe(testPersonLocation)
		expect(cityPerson.getCity()).toBe(city)

		// there should be test-person in both town and city
		expect(town.hasPerson('test-person')).toBe(true)
		expect(city.hasPerson('test-person')).toBe(true)
	})

	it('should be able to set attributes to people and not affect others', () => {
		// city person and town person shouldn't be the same person
		expect(city.getPerson('test-person')).not.toBe(town.getPerson('test-person'))
		townPerson.setAttribute('name', 'alan')
		expect(townPerson.getAttribute('name')).toBe('alan')
		expect(cityPerson.getAttribute('name')).not.toBe('alan')

		// if I were to kill town person
		town.killPerson('test-person')
		// city person should still exist
		expect(fs.existsSync(testPersonLocation)).toBe(true)

		townPerson = null
	})

	const complicatedAttributes = {
		name: 'Bryan',
		level: 99,
		skills: {
			martial: ['axe master', 'judo', 'karate', 'heavy armor'],
			weapon: ['axe', 'hammer', 'gauntlet'],
			armor: ['heavy']
		},
		items: [
			['healing potion', 15],
			['bomb', 5],
			['antidote', 8]
		]
	}

	it('should be able to set complicated attributes to person', () => {
		expect(cityPerson.getAttribute('name')).toBe(undefined)
		cityPerson.setAttributes(complicatedAttributes)
		expect(cityPerson.getAttribute('name')).toBe('Bryan')
		expect(cityPerson.getAttribute('items')).toStrictEqual(
			expect.arrayContaining([
				['healing potion', 15],
				['bomb', 5],
				['antidote', 8]
			])
		)
		cityPerson.setAttribute('items', [...cityPerson.getAttribute('items'), ['coffee', '20oz']])
		expect(cityPerson.getAttribute('items')).toStrictEqual(
			expect.arrayContaining([
				['healing potion', 15],
				['bomb', 5],
				['antidote', 8],
				['coffee', '20oz']
			])
		)
	})

	test('overload methods, and existing tables and data should be loaded', () => {
		let testStorage = new Storage(testKingdomLocation)
		expect(Object.keys(testStorage.tables).length).toBe(2)

		let testTable = testStorage.getTable('test-city')
		expect(testTable.location).toBe(testCityLocation)
		expect(Object.keys(testTable.lines).length).toBe(1)

		let testDataLine = testTable.getLine('test-person')
		expect(testDataLine.getData('items')).toStrictEqual(
			expect.arrayContaining([
				['healing potion', 15],
				['bomb', 5],
				['antidote', 8],
				['coffee', '20oz']
			])
		)

		expect(Object.keys(testDataLine.getData('skills'))).toStrictEqual(
			expect.arrayContaining(['martial', 'weapon', 'armor'])
		)
	})

	it('should remove every person if I destory a city', () => {
		expect(fs.existsSync(testCityLocation)).toBe(true)
		expect(fs.existsSync(testPersonLocation)).toBe(true)
		testKingdom.destoryCity('test-city')
		expect(testKingdom.hasCity('test-city')).toBe(false)
		expect(fs.existsSync(testPersonLocation)).toBe(false)
		expect(fs.existsSync(testCityLocation)).toBe(false)

		// town should not be removed
		expect(fs.existsSync(town.location)).toBe(true)
	})

	test('sample code should run without errors', () => {
		// Run the example
		expect(() => example(sampleLocation)).not.toThrow()

		// Validate the example created the expected structure
		expect(fs.existsSync(sampleLocation)).toBe(true)
		expect(fs.existsSync(`${sampleLocation}${path.sep}users`)).toBe(true)
		expect(fs.existsSync(`${sampleLocation}${path.sep}users${path.sep}user_001`)).toBe(true)

		// Validate the data was stored correctly
		const storage = new Storage(sampleLocation)
		const userData = storage.getTable('users').getLine('user_001').getData()
		expect(userData.name).toBe('John Doe')
		expect(userData.email).toBe('john@example.com')
		expect(userData.id).toBe(1)
	})

	afterAll(() => {
		// tear down everything
		if (fs.existsSync(testKingdomLocation)) fs.rmSync(testKingdomLocation, { recursive: true, force: true })
		if (fs.existsSync(sampleLocation)) fs.rmSync(sampleLocation, { recursive: true, force: true })
	})
})
