-- Manpower: Recruitment & HR Management System (PostgreSQL 16)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
DROP TABLE IF EXISTS interviews, prescreens, applications, candidate_skills, educations,
  experiences, candidates, job_skills, jobs, skills, companies, users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('job_seeker','employer','recruiter')),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  industry VARCHAR(150),
  location VARCHAR(100),
  employee_range VARCHAR(30),
  about TEXT
);
CREATE TABLE skills (id SERIAL PRIMARY KEY, name VARCHAR(60) UNIQUE NOT NULL);
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  location VARCHAR(100),
  salary_min INT, salary_max INT,
  openings INT DEFAULT 1,
  min_education VARCHAR(50),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','in_progress','closed')),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE job_skills (
  job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
  skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (job_id, skill_id)
);
CREATE TABLE candidates (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150), phone VARCHAR(30),
  desired_position VARCHAR(150),
  location VARCHAR(100),
  years_experience NUMERIC(3,1) DEFAULT 0,
  summary TEXT,
  resume_url TEXT,
  source VARCHAR(30) DEFAULT 'website' CHECK (source IN ('website','linkedin','jobthai','other')),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE candidate_skills (
  candidate_id INT REFERENCES candidates(id) ON DELETE CASCADE,
  skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (candidate_id, skill_id)
);
CREATE TABLE educations (
  id SERIAL PRIMARY KEY,
  candidate_id INT REFERENCES candidates(id) ON DELETE CASCADE,
  institution VARCHAR(200), faculty VARCHAR(200), degree VARCHAR(100),
  start_year INT, end_year INT
);
CREATE TABLE experiences (
  id SERIAL PRIMARY KEY,
  candidate_id INT REFERENCES candidates(id) ON DELETE CASCADE,
  company_name VARCHAR(200), position VARCHAR(150),
  start_date DATE, end_date DATE, description TEXT
);
-- Pipeline: applied -> prescreen -> sent_to_client -> interview -> passed (or failed)
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  candidate_id INT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  job_id INT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'applied'
    CHECK (status IN ('applied','prescreen','sent_to_client','interview','passed','failed')),
  applied_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (candidate_id, job_id)
);
CREATE TABLE prescreens (
  id SERIAL PRIMARY KEY,
  application_id INT REFERENCES applications(id) ON DELETE CASCADE,
  result VARCHAR(10) CHECK (result IN ('pass','fail','hold')),
  notes TEXT,
  screened_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE interviews (
  id SERIAL PRIMARY KEY,
  application_id INT REFERENCES applications(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  location VARCHAR(200),
  result VARCHAR(10) DEFAULT 'pending' CHECK (result IN ('pending','pass','fail')),
  offered_salary INT,
  notes TEXT
);
CREATE INDEX idx_candidates_location ON candidates(location);
CREATE INDEX idx_applications_status ON applications(status);

-- ===== Dummy data (login ตัวอย่าง: recruiter@manpower.com / password123) =====
INSERT INTO users (full_name, email, password_hash, role) VALUES
 ('สวัสดี Recruiter', 'recruiter@manpower.com', crypt('password123', gen_salt('bf')), 'recruiter');

INSERT INTO companies (name, industry, location, employee_range, about) VALUES
 ('บริษัท เทคพลัส จำกัด', 'เทคโนโลยีสารสนเทศ / ซอฟต์แวร์', 'กรุงเทพมหานคร', '201-500', 'พัฒนาซอฟต์แวร์และโซลูชันดิจิทัลสำหรับองค์กร'),
 ('บริษัท เน็กซ์เวฟ ดิจิทัล จำกัด', 'ดิจิทัลเอเจนซี่', 'นนทบุรี', '51-200', 'ออกแบบและพัฒนาเว็บแอปพลิเคชัน');

INSERT INTO skills (id, name) VALUES
 (1,'Java'),(2,'Python'),(3,'SQL'),(4,'HTML'),(5,'CSS'),
 (6,'JavaScript'),(7,'React'),(8,'Node.js'),(9,'Spring Boot'),(10,'Docker');

INSERT INTO jobs (id, company_id, title, location, salary_min, salary_max, openings, min_education) VALUES
 (1, 1, 'Full Stack Developer', 'กรุงเทพฯ', 35000, 50000, 2, 'ปริญญาตรี'),
 (2, 1, 'Backend Developer',    'ปทุมธานี', 30000, 50000, 1, 'ปริญญาตรี'),
 (3, 2, 'Frontend Developer',   'นนทบุรี',  25000, 45000, 2, 'ปริญญาตรี');
INSERT INTO job_skills (job_id, skill_id) VALUES
 (1,7),(1,8),(1,6),(1,3),
 (2,1),(2,9),(2,3),(2,10),
 (3,4),(3,5),(3,6),(3,7);

INSERT INTO candidates (id, full_name, email, phone, desired_position, location, years_experience, summary, source) VALUES
 (1,'ธนกร วัฒนกุล','demo1@gmail.com','012-000-0001','Full Stack Developer','กรุงเทพ',3,'Full Stack 3 ปี เน้น React/Node.js','website'),
 (2,'พิมพ์ชนก ศรีสุวรรณ','demo2@gmail.com','012-000-0002','Web Developer','กรุงเทพ',2,'Web Developer 2 ปี','linkedin'),
 (3,'ภูริณัฐ จันทร์ประเสริฐ','demo3@gmail.com','012-000-0003','Software Developer','นนทบุรี',4,'Java/Spring Boot 4 ปี','jobthai'),
 (4,'ธีรภัทร แสงทอง','demo4@gmail.com','012-000-0004','Backend Developer','นครปฐม',4,'Backend 4 ปี','website'),
 (5,'อรปรียา ธรรมรักษ์','demo5@gmail.com','012-000-0005','Web Developer','ปทุมธานี',2,'Front-end 2 ปี','linkedin'),
 (6,'กรรณวรรณ ศรีสุข','demo6@gmail.com','012-000-0006','Junior Developer','กรุงเทพ',2,'นักพัฒนา Web Application 2 ปี สนใจเทคโนโลยีใหม่ ๆ','website');
INSERT INTO candidate_skills (candidate_id, skill_id) VALUES
 (1,7),(1,8),(1,6),(1,3),
 (2,4),(2,5),(2,6),
 (3,1),(3,9),(3,3),(3,10),
 (4,1),(4,9),(4,3),
 (5,4),(5,5),(5,6),(5,7),
 (6,1),(6,2),(6,3),(6,4),(6,5),(6,6);
INSERT INTO educations (candidate_id, institution, faculty, degree, start_year, end_year) VALUES
 (6,'มหาวิทยาลัยศิลปากร','คณะวิทยาการเทคโนโลยีสารสนเทศ','ปริญญาตรี',2563,2567);
INSERT INTO experiences (candidate_id, company_name, position, start_date, end_date) VALUES
 (6,'บริษัท AEC Tech จำกัด','Junior Developer','2022-05-01',NULL),
 (6,'บริษัท XYZ Co., Ltd.','Intern Developer','2021-06-01','2022-04-30');

INSERT INTO applications (candidate_id, job_id, status, applied_at) VALUES
 (1,1,'sent_to_client','2026-01-05'),(2,3,'applied','2026-01-12'),
 (3,2,'prescreen','2026-02-19'),(4,2,'interview','2026-04-11'),
 (5,3,'passed','2026-05-21'),(6,1,'failed','2026-08-18');
INSERT INTO prescreens (application_id, result, notes) VALUES (3,'pass','สื่อสารดี พร้อมเริ่มงาน 30 วัน');
INSERT INTO interviews (application_id, scheduled_at, location, result, offered_salary) VALUES
 (4,'2026-04-20 10:00+07','Tech Plus ชั้น 5','pending',NULL),
 (5,'2026-05-28 14:00+07','Online (Google Meet)','pass',38000);
