import { query } from '../config/db.js';

// GET /api/candidates?q=&location=&skill=React,SQL&min_exp=&max_exp=&job_id=&sort=
export async function searchCandidates(req, res, next) {
  try {
    const { q, location, skill, min_exp, max_exp, job_id, sort } = req.query;
    const params = [];
    const add = (v) => { params.push(v); return `$${params.length}`; };
    const where = [];
    let matchCol = 'NULL::int';
    let lateral = '';

    if (job_id) {
      const p = add(Number(job_id));
      matchCol = 'm.match_percent';
      lateral = `LEFT JOIN LATERAL (
        SELECT ROUND(100.0 * COUNT(cs.skill_id) / NULLIF(COUNT(js.skill_id), 0))::int AS match_percent
        FROM job_skills js
        LEFT JOIN candidate_skills cs ON cs.skill_id = js.skill_id AND cs.candidate_id = c.id
        WHERE js.job_id = ${p}) m ON true`;
    }
    if (q) {
      const p = add(`%${q}%`);
      where.push(`(c.full_name ILIKE ${p} OR c.desired_position ILIKE ${p} OR c.summary ILIKE ${p})`);
    }
    if (location) where.push(`c.location ILIKE ${add(`%${location}%`)}`);
    if (skill) {
      const p = add(skill.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean));
      where.push(`EXISTS (SELECT 1 FROM candidate_skills x JOIN skills sk ON sk.id = x.skill_id
                          WHERE x.candidate_id = c.id AND LOWER(sk.name) = ANY(${p}))`);
    }
    if (min_exp !== undefined && min_exp !== '') where.push(`c.years_experience >= ${add(Number(min_exp))}`);
    if (max_exp !== undefined && max_exp !== '') where.push(`c.years_experience < ${add(Number(max_exp))}`);

    const orderBy = job_id && sort !== 'recent'
      ? 'match_percent DESC NULLS LAST, c.years_experience DESC'
      : 'c.created_at DESC, c.id';

    const { rows } = await query(
      `SELECT c.id, c.full_name, c.email, c.phone, c.desired_position, c.location,
              c.years_experience, ${matchCol} AS match_percent,
              COALESCE((SELECT json_agg(sk.name ORDER BY sk.name)
                        FROM candidate_skills x JOIN skills sk ON sk.id = x.skill_id
                        WHERE x.candidate_id = c.id), '[]'::json) AS skills,
              COUNT(*) OVER() AS total
       FROM candidates c ${lateral}
       ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
       ORDER BY ${orderBy} LIMIT 50`,
      params
    );
    res.json({ total: rows.length ? Number(rows[0].total) : 0, data: rows });
  } catch (err) { next(err); }
}

// GET /api/jobs  (ใช้เป็นตัวเลือกตำแหน่งงานสำหรับคำนวณ Match %)
export async function listJobs(_req, res, next) {
  try {
    const { rows } = await query(
      `SELECT j.id, j.title, co.name AS company FROM jobs j
       JOIN companies co ON co.id = j.company_id WHERE j.status <> 'closed' ORDER BY j.id`);
    res.json(rows);
  } catch (err) { next(err); }
}
