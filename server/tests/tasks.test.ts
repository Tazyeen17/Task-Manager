import request from 'supertest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import app from '../src/index';

// Mock the file system so tests don't touch disk
vi.mock('fs', async () => {
  const actual = await vi.importActual<typeof import('fs')>('fs');
  let store: string = '[]';
  return {
    ...actual,
    existsSync: () => true,
    readFileSync: () => store,
    writeFileSync: (_path: string, data: string) => { store = data; },
    mkdirSync: () => {},
  };
});

describe('Tasks API', () => {
  beforeEach(() => {
    // Reset the in-memory store before each test by re-importing isn't trivial with vitest,
    // so we clear via DELETE all approach
  });

  describe('GET /api/tasks', () => {
    it('returns 200 with an array', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/tasks', () => {
    it('creates a task and returns 201', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test Task', description: 'Hello', dueDate: '2025-12-31' });
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Test Task');
      expect(res.body.completed).toBe(false);
      expect(res.body.id).toBeDefined();
    });

    it('returns 400 when title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title here' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/title/i);
    });

    it('returns 400 when title is empty string', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: '   ' });
      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('updates a task and returns the updated task', async () => {
      const create = await request(app)
        .post('/api/tasks')
        .send({ title: 'Original Title' });
      const id = create.body.id;

      const res = await request(app)
        .patch(`/api/tasks/${id}`)
        .send({ title: 'Updated Title', completed: true });
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Title');
      expect(res.body.completed).toBe(true);
    });

    it('returns 404 for unknown id', async () => {
      const res = await request(app)
        .patch('/api/tasks/nonexistent-id')
        .send({ title: 'Nope' });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('deletes a task and returns success message', async () => {
      const create = await request(app)
        .post('/api/tasks')
        .send({ title: 'To be deleted' });
      const id = create.body.id;

      const res = await request(app).delete(`/api/tasks/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });

    it('returns 404 for unknown id', async () => {
      const res = await request(app).delete('/api/tasks/nonexistent-id');
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/tasks/reorder', () => {
    it('returns 400 if orderedIds is not an array', async () => {
      const res = await request(app)
        .put('/api/tasks/reorder')
        .send({ orderedIds: 'not-an-array' });
      expect(res.status).toBe(400);
    });

    it('accepts a valid orderedIds array', async () => {
      const res = await request(app)
        .put('/api/tasks/reorder')
        .send({ orderedIds: [] });
      expect(res.status).toBe(200);
    });
  });
});
