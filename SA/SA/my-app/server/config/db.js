import pg from 'pg';
import { config } from './index.js';

export const pool = new pg.Pool(config.db);
export const query = (text, params) => pool.query(text, params);
