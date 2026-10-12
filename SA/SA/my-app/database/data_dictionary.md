# Data Dictionary – Manpower

| ตาราง | หน้าที่ | คอลัมน์หลัก |
|---|---|---|
| users | บัญชีผู้ใช้ + role (`job_seeker`, `employer`, `recruiter`) | email, password_hash (bcrypt), role |
| companies | ข้อมูลบริษัทลูกค้า | name, industry, employee_range, about |
| jobs | Job Requirement จากลูกค้า | company_id, title, location, salary_min/max, openings, status |
| skills | รายการทักษะกลาง | name (unique) |
| job_skills | ทักษะที่ตำแหน่งงานต้องการ (M:N) | job_id, skill_id |
| candidates | โปรไฟล์ผู้สมัคร | full_name, desired_position, location, years_experience, resume_url, source |
| candidate_skills | ทักษะของผู้สมัคร (M:N) | candidate_id, skill_id |
| educations / experiences | ประวัติการศึกษา / ประสบการณ์ทำงาน | candidate_id, ... |
| applications | การสมัคร 1 คน/1 ตำแหน่ง + สถานะ pipeline | status: applied → prescreen → sent_to_client → interview → passed / failed |
| prescreens | ผล Pre-screen | application_id, result (pass/fail/hold), notes |
| interviews | นัดสัมภาษณ์และผล | scheduled_at, result (pending/pass/fail), offered_salary |

**Match %** = (จำนวนทักษะของผู้สมัครที่ตรงกับ job_skills ÷ จำนวนทักษะที่ตำแหน่งงานต้องการ) × 100
