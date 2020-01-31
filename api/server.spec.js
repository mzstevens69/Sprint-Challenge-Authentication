const server = require('./server')
const db = require('../database/dbConfig')
const request = require('supertest')
// is the test working

describe('server', () => {
    it('runs the tests', () => {
        expect(true).toBe(true)
    })
})
// is test showing process.env.DB_ENV=testing
describe('GET /', () => {
    it('has environment process as testing', () => {
        expect(process.env.DB_ENV).toBe('testing')
    })
})

describe('POST /api/auth/register', () => {
   beforeEach(async () => {
       await db('users').truncate()
   })
    it('register users should return 201', () => {
        return request(server).post('/api/auth/register')
        .send({ username: 'test0', password: 'test0'})
        .then(res => {
            expect(res.status).toBe(201)
        })
        
    })
    it('returns username', () => {
        let user = { username: 'test00', password: 'test00' }
        return request(server).post('/api/auth/register')
        .send(user)
        .then(res => {
            expect(res.body.username).toMatch('test00')
        })

    })

})

describe('POST /api/auth/login', () => {
    beforeEach(async () => {
        await db('users').truncate()
    })
    
    it('return 200', () => {
        let user = { username: 'test000', password: 'test000'}
        return request(server).post('/api/auth/login')
        .send(user)
        .then(res => {
            200, { message: `Welcome ${user.username} you are logged in !`, token: res.body.token };
      })
   
    })
    
    it('returns 401', () => {
        let user = { username: 'test', password: 'test'}
        return request(server).post('/api/auth/login')
        .send(user)
        .then(res => {
            expect(res.status).toBe(401)
        })
    })

})
