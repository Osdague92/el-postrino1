const request = require('supertest');
const app = require('../server');
const fs = require('fs').promises;
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db');
const usuariosPath = path.join(dbPath, 'usuarios.json');

beforeEach(async () => {
  // Reset the database before each test
  await fs.writeFile(usuariosPath, JSON.stringify([], null, 2));
});

describe('POST /usuarios', () => {
  it('should create a new user with valid data', async () => {
    const res = await request(app)
      .post('/usuarios')
      .send({
        nombre: 'Test User',
        email: 'test@example.com'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nombre).toBe('Test User');
    expect(res.body.email).toBe('test@example.com');
  });

  it('should return an error if email is invalid', async () => {
    const res = await request(app)
      .post('/usuarios')
      .send({
        nombre: 'Test User',
        email: 'not-an-email'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('should return an error if name is missing', async () => {
    const res = await request(app)
      .post('/usuarios')
      .send({
        email: 'test@example.com'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('should return an error if email is already in use', async () => {
    // First, create a user
    await request(app)
      .post('/usuarios')
      .send({
        nombre: 'Test User',
        email: 'test@example.com'
      });

    // Then, try to create another user with the same email
    const res = await request(app)
      .post('/usuarios')
      .send({
        nombre: 'Another User',
        email: 'test@example.com'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Email already in use');
  });
});