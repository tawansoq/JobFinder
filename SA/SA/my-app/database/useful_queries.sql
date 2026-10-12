-- 1) คำนวณ Match % ของผู้สมัครทุกคนกับตำแหน่งงาน (เปลี่ยน job_id = 1 ตามต้องการ)
SELECT c.id, c.full_name,
       ROUND(100.0 * COUNT(cs.skill_id) / COUNT(js.skill_id)) AS match_percent
FROM candidates c
JOIN job_skills js ON js.job_id = 1
LEFT JOIN candidate_skills cs ON cs.candidate_id = c.id AND cs.skill_id = js.skill_id
GROUP BY c.id, c.full_name
ORDER BY match_percent DESC;

-- 2) ค้นหาผู้สมัครตามสกิล + พื้นที่
SELECT c.full_name, c.location, string_agg(s.name, ', ') AS skills
FROM candidates c
JOIN candidate_skills cs ON cs.candidate_id = c.id
JOIN skills s ON s.id = cs.skill_id
WHERE c.location ILIKE '%กรุงเทพ%'
GROUP BY c.id HAVING bool_or(s.name = 'JavaScript');

-- 3) จำนวนผู้สมัครในแต่ละสถานะ (Pipeline)
SELECT status, COUNT(*) FROM applications GROUP BY status;
