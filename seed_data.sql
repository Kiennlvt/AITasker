-- ============================================================
-- SEED DATA: AITasker
-- client : ngancnt62@gmail.com  (aba3403c-7593-4b9c-9117-f4741858d270)
-- expert : expert@aitasker.com  (3938a7e1-00e6-41fb-80f0-5db12934b7bb)
-- Mỗi bảng liên quan: 10 rows
-- ============================================================

-- Alias cố định
-- CLIENT_ID = 'aba3403c-7593-4b9c-9117-f4741858d270'
-- EXPERT_ID = '3938a7e1-00e6-41fb-80f0-5db12934b7bb'

-- ============================================================
-- 1. USER_SKILLS — thêm skills cho client (hiện có 0)
--    expert đã có 5 skill, thêm 5 nữa → đủ 10 cho expert
-- ============================================================
INSERT INTO user_skills (user_id, skill) VALUES
  -- Client skills (mới hoàn toàn)
  ('aba3403c-7593-4b9c-9117-f4741858d270', 'Project Management'),
  ('aba3403c-7593-4b9c-9117-f4741858d270', 'Product Strategy'),
  ('aba3403c-7593-4b9c-9117-f4741858d270', 'UI/UX Design'),
  ('aba3403c-7593-4b9c-9117-f4741858d270', 'Agile Scrum'),
  ('aba3403c-7593-4b9c-9117-f4741858d270', 'Business Analysis'),
  -- Expert skills (thêm vào 5 hiện có: Python, NLP, LangChain, TensorFlow, FastAPI)
  ('3938a7e1-00e6-41fb-80f0-5db12934b7bb', 'Spring Boot'),
  ('3938a7e1-00e6-41fb-80f0-5db12934b7bb', 'React'),
  ('3938a7e1-00e6-41fb-80f0-5db12934b7bb', 'Docker'),
  ('3938a7e1-00e6-41fb-80f0-5db12934b7bb', 'PostgreSQL'),
  ('3938a7e1-00e6-41fb-80f0-5db12934b7bb', 'AWS')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 2. JOB_POSTS — 10 jobs của client ngancnt62
-- ============================================================
INSERT INTO job_posts (id, client_id, title, description, budget, deadline, status, created_at)
VALUES
  ('aab11111-1111-1111-1111-111111111101',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   'Build AI Chatbot for E-commerce Customer Support',
   'Cần xây dựng chatbot AI sử dụng LLM để tự động trả lời câu hỏi khách hàng, tích hợp vào website thương mại điện tử. Yêu cầu RAG pipeline và knowledge base riêng.',
   2500.00, '2026-04-30', 'COMPLETED', '2026-02-01 09:00:00'),

  ('aab11111-1111-1111-1111-111111111102',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   'Data Analytics Dashboard with Real-time Metrics',
   'Xây dựng dashboard analytics real-time cho hệ thống bán lẻ, bao gồm biểu đồ doanh thu, tồn kho, và KPI. Tech stack: React + Spring Boot + PostgreSQL.',
   1800.00, '2026-03-31', 'COMPLETED', '2026-01-15 10:00:00'),

  ('aab11111-1111-1111-1111-111111111103',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   'Mobile App Backend API Development',
   'Phát triển RESTful API cho ứng dụng mobile thương mại điện tử. Bao gồm auth, product catalog, cart, orders, payment integration. Dùng Spring Boot + PostgreSQL.',
   2200.00, '2026-04-15', 'COMPLETED', '2026-01-20 11:00:00'),

  ('aab11111-1111-1111-1111-111111111104',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   'Sentiment Analysis for Product Reviews',
   'Xây dựng hệ thống phân tích sentiment tự động cho đánh giá sản phẩm. Model cần xử lý cả tiếng Việt và tiếng Anh, tích hợp qua REST API.',
   1500.00, '2026-04-20', 'COMPLETED', '2026-02-10 08:30:00'),

  ('aab11111-1111-1111-1111-111111111105',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   'Recommendation System for E-commerce Platform',
   'Phát triển hệ thống gợi ý sản phẩm dùng collaborative filtering và content-based filtering. Cần tích hợp với database hiện có và expose qua API.',
   3000.00, '2026-05-15', 'COMPLETED', '2026-02-20 14:00:00'),

  ('aab11111-1111-1111-1111-111111111106',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   'React Frontend Redesign with Tailwind CSS',
   'Redesign toàn bộ giao diện web application dùng React 18 + Tailwind CSS. Cần responsive design, dark mode, và cải thiện UX theo Figma prototype đã có.',
   1200.00, '2026-06-30', 'IN_PROGRESS', '2026-03-01 09:00:00'),

  ('aab11111-1111-1111-1111-111111111107',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   'Docker & CI/CD Pipeline Setup',
   'Containerize ứng dụng Spring Boot và React bằng Docker, setup CI/CD pipeline với GitHub Actions. Deploy lên AWS ECS hoặc EC2 với auto-scaling.',
   1400.00, '2026-07-15', 'IN_PROGRESS', '2026-03-10 10:00:00'),

  ('aab11111-1111-1111-1111-111111111108',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   'PostgreSQL Performance Optimization',
   'Audit và tối ưu các query PostgreSQL hiện tại, thêm indexes phù hợp, tối ưu schema, và setup query caching. Database ~5 triệu records.',
   900.00, '2026-07-01', 'IN_PROGRESS', '2026-03-15 11:00:00'),

  ('aab11111-1111-1111-1111-111111111109',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   'Customer Churn Prediction ML Model',
   'Xây dựng và deploy mô hình machine learning dự đoán khách hàng có khả năng rời bỏ. Cần EDA, feature engineering, model training, và API deployment.',
   2800.00, '2026-08-01', 'IN_PROGRESS', '2026-04-01 09:00:00'),

  ('aab11111-1111-1111-1111-111111111110',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   'NLP Text Classification for Support Tickets',
   'Xây dựng pipeline phân loại ticket hỗ trợ khách hàng tự động theo danh mục (billing, technical, shipping...). Tích hợp với hệ thống CRM qua webhook.',
   1600.00, '2026-08-20', 'IN_PROGRESS', '2026-04-10 08:00:00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. JOB_SKILLS
-- ============================================================
INSERT INTO job_skills (job_id, skill) VALUES
  ('aab11111-1111-1111-1111-111111111101', 'Python'),
  ('aab11111-1111-1111-1111-111111111101', 'LangChain'),
  ('aab11111-1111-1111-1111-111111111101', 'RAG'),

  ('aab11111-1111-1111-1111-111111111102', 'React'),
  ('aab11111-1111-1111-1111-111111111102', 'Spring Boot'),
  ('aab11111-1111-1111-1111-111111111102', 'PostgreSQL'),

  ('aab11111-1111-1111-1111-111111111103', 'Spring Boot'),
  ('aab11111-1111-1111-1111-111111111103', 'PostgreSQL'),
  ('aab11111-1111-1111-1111-111111111103', 'REST API'),

  ('aab11111-1111-1111-1111-111111111104', 'Python'),
  ('aab11111-1111-1111-1111-111111111104', 'NLP'),
  ('aab11111-1111-1111-1111-111111111104', 'TensorFlow'),

  ('aab11111-1111-1111-1111-111111111105', 'Python'),
  ('aab11111-1111-1111-1111-111111111105', 'Machine Learning'),
  ('aab11111-1111-1111-1111-111111111105', 'FastAPI'),

  ('aab11111-1111-1111-1111-111111111106', 'React'),
  ('aab11111-1111-1111-1111-111111111106', 'Tailwind CSS'),
  ('aab11111-1111-1111-1111-111111111106', 'TypeScript'),

  ('aab11111-1111-1111-1111-111111111107', 'Docker'),
  ('aab11111-1111-1111-1111-111111111107', 'AWS'),
  ('aab11111-1111-1111-1111-111111111107', 'GitHub Actions'),

  ('aab11111-1111-1111-1111-111111111108', 'PostgreSQL'),
  ('aab11111-1111-1111-1111-111111111108', 'SQL'),
  ('aab11111-1111-1111-1111-111111111108', 'Database Tuning'),

  ('aab11111-1111-1111-1111-111111111109', 'Python'),
  ('aab11111-1111-1111-1111-111111111109', 'Machine Learning'),
  ('aab11111-1111-1111-1111-111111111109', 'Scikit-learn'),

  ('aab11111-1111-1111-1111-111111111110', 'Python'),
  ('aab11111-1111-1111-1111-111111111110', 'NLP'),
  ('aab11111-1111-1111-1111-111111111110', 'LangChain')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 4. PROPOSALS — 10 proposals của expert cho 10 jobs trên
-- ============================================================
INSERT INTO proposals (id, job_id, expert_id, cover_letter, bid_amount, delivery_time, status, created_at)
VALUES
  ('aab22222-2222-2222-2222-222222222201',
   'aab11111-1111-1111-1111-111111111101',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'Tôi có 3 năm kinh nghiệm xây dựng chatbot AI với LangChain và RAG pipeline. Đã triển khai thành công cho 5 công ty. Tôi có thể deliver đúng deadline với chất lượng cao nhất.',
   2300.00, 28, 'ACCEPTED', '2026-02-03 10:00:00'),

  ('aab22222-2222-2222-2222-222222222202',
   'aab11111-1111-1111-1111-111111111102',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'React + Spring Boot + PostgreSQL là tech stack tôi làm hàng ngày. Tôi sẽ xây dựng dashboard với WebSocket real-time updates và charts đẹp mắt.',
   1650.00, 20, 'ACCEPTED', '2026-01-17 09:30:00'),

  ('aab22222-2222-2222-2222-222222222203',
   'aab11111-1111-1111-1111-111111111103',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'Spring Boot REST API với JWT authentication, pagination, và clean architecture là sở trường của tôi. Code sạch, có unit test và API documentation.',
   2000.00, 25, 'ACCEPTED', '2026-01-22 11:00:00'),

  ('aab22222-2222-2222-2222-222222222204',
   'aab11111-1111-1111-1111-111111111104',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'Tôi chuyên NLP cho tiếng Việt và tiếng Anh. Đã build sentiment model đạt 92% accuracy. Sẽ dùng PhoBERT cho Vietnamese và BERT cho English.',
   1400.00, 18, 'ACCEPTED', '2026-02-12 08:00:00'),

  ('aab22222-2222-2222-2222-222222222205',
   'aab11111-1111-1111-1111-111111111105',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'Recommendation system tôi đã xây dựng cho sàn thương mại điện tử với 1 triệu user. Kết hợp collaborative filtering và content-based, deploy bằng FastAPI.',
   2700.00, 35, 'ACCEPTED', '2026-02-22 14:30:00'),

  ('aab22222-2222-2222-2222-222222222206',
   'aab11111-1111-1111-1111-111111111106',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'React 18 + Tailwind CSS + Zustand là stack tôi dùng cho mọi dự án frontend. Tôi sẽ implement theo đúng Figma, có animation mượt và fully responsive.',
   1100.00, 21, 'ACCEPTED', '2026-03-03 09:00:00'),

  ('aab22222-2222-2222-2222-222222222207',
   'aab11111-1111-1111-1111-111111111107',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'Docker + GitHub Actions CI/CD là setup tôi làm cho mọi dự án. Deploy lên AWS ECS với auto-scaling, health checks, và rollback tự động khi có lỗi.',
   1300.00, 14, 'ACCEPTED', '2026-03-12 10:30:00'),

  ('aab22222-2222-2222-2222-222222222208',
   'aab11111-1111-1111-1111-111111111108',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'PostgreSQL optimization là kỹ năng core của tôi. Sẽ dùng EXPLAIN ANALYZE, thêm composite indexes, và implement materialized views để tăng tốc query.',
   850.00, 10, 'ACCEPTED', '2026-03-17 11:00:00'),

  ('aab22222-2222-2222-2222-222222222209',
   'aab11111-1111-1111-1111-111111111109',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'Đã xây dựng churn model cho 3 công ty SaaS với AUC > 0.88. Sẽ làm đầy đủ từ EDA, feature engineering, model selection, đến deployment với monitoring.',
   2600.00, 30, 'ACCEPTED', '2026-04-03 09:30:00'),

  ('aab22222-2222-2222-2222-222222222210',
   'aab11111-1111-1111-1111-111111111110',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'NLP text classification với BERT fine-tuning là điểm mạnh của tôi. Sẽ xây pipeline từ data preprocessing đến production API với webhook integration.',
   1500.00, 21, 'ACCEPTED', '2026-04-12 08:30:00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 5. PROJECTS — 10 projects giữa client + expert
--    Job 1-5: COMPLETED | Job 6-10: ACTIVE
-- ============================================================
INSERT INTO projects (id, job_id, client_id, expert_id, status, created_at, updated_at)
VALUES
  ('aab33333-3333-3333-3333-333333333301',
   'aab11111-1111-1111-1111-111111111101',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'COMPLETED', '2026-02-05 08:00:00', '2026-04-25 17:00:00'),

  ('aab33333-3333-3333-3333-333333333302',
   'aab11111-1111-1111-1111-111111111102',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'COMPLETED', '2026-01-18 08:00:00', '2026-03-28 16:00:00'),

  ('aab33333-3333-3333-3333-333333333303',
   'aab11111-1111-1111-1111-111111111103',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'COMPLETED', '2026-01-23 08:00:00', '2026-04-10 15:00:00'),

  ('aab33333-3333-3333-3333-333333333304',
   'aab11111-1111-1111-1111-111111111104',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'COMPLETED', '2026-02-14 08:00:00', '2026-04-15 14:00:00'),

  ('aab33333-3333-3333-3333-333333333305',
   'aab11111-1111-1111-1111-111111111105',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'COMPLETED', '2026-02-24 08:00:00', '2026-05-10 16:00:00'),

  ('aab33333-3333-3333-3333-333333333306',
   'aab11111-1111-1111-1111-111111111106',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'ACTIVE', '2026-03-05 08:00:00', '2026-05-28 10:00:00'),

  ('aab33333-3333-3333-3333-333333333307',
   'aab11111-1111-1111-1111-111111111107',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'ACTIVE', '2026-03-14 08:00:00', '2026-05-29 09:00:00'),

  ('aab33333-3333-3333-3333-333333333308',
   'aab11111-1111-1111-1111-111111111108',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'ACTIVE', '2026-03-18 08:00:00', '2026-05-30 11:00:00'),

  ('aab33333-3333-3333-3333-333333333309',
   'aab11111-1111-1111-1111-111111111109',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'ACTIVE', '2026-04-05 08:00:00', '2026-05-30 14:00:00'),

  ('aab33333-3333-3333-3333-333333333310',
   'aab11111-1111-1111-1111-111111111110',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'ACTIVE', '2026-04-14 08:00:00', '2026-05-31 09:00:00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 6. MILESTONES — 10 milestones (1 per project)
-- ============================================================
INSERT INTO milestones (id, project_id, title, description, amount, due_date, deliverable_note, status, created_at)
VALUES
  ('aab44444-4444-4444-4444-444444444401',
   'aab33333-3333-3333-3333-333333333301',
   'RAG Chatbot Full Delivery',
   'Hoàn thành toàn bộ chatbot: RAG pipeline, knowledge base ingestion, REST API, và UI widget tích hợp website.',
   2300.00, '2026-04-28', 'Đã deploy production, tài liệu kỹ thuật và hướng dẫn sử dụng đầy đủ.',
   'APPROVED', '2026-02-06 09:00:00'),

  ('aab44444-4444-4444-4444-444444444402',
   'aab33333-3333-3333-3333-333333333302',
   'Analytics Dashboard Full Delivery',
   'Dashboard React hoàn chỉnh với real-time charts, export PDF/Excel, và user permission management.',
   1650.00, '2026-03-28', 'Source code, Docker image, và hướng dẫn deploy đã bàn giao.',
   'APPROVED', '2026-01-19 09:00:00'),

  ('aab44444-4444-4444-4444-444444444403',
   'aab33333-3333-3333-3333-333333333303',
   'Mobile Backend API Delivery',
   'Toàn bộ REST API endpoints: auth, products, cart, orders, payment. Swagger docs và Postman collection.',
   2000.00, '2026-04-13', 'API docs, unit tests 85% coverage, và deploy trên staging server.',
   'APPROVED', '2026-01-24 09:00:00'),

  ('aab44444-4444-4444-4444-444444444404',
   'aab33333-3333-3333-3333-333333333304',
   'Sentiment Analysis API Delivery',
   'Model fine-tuned PhoBERT + BERT, REST API deployment, và dashboard monitoring accuracy.',
   1400.00, '2026-04-18', 'Model files, API endpoint, accuracy report 91.5% trên test set.',
   'APPROVED', '2026-02-15 09:00:00'),

  ('aab44444-4444-4444-4444-444444444405',
   'aab33333-3333-3333-3333-333333333305',
   'Recommendation System Delivery',
   'Hệ thống gợi ý hoàn chỉnh: offline training pipeline, online serving API, và A/B testing framework.',
   2700.00, '2026-05-12', 'Python packages, FastAPI service, monitoring dashboard, và A/B test report.',
   'APPROVED', '2026-02-25 09:00:00'),

  ('aab44444-4444-4444-4444-444444444406',
   'aab33333-3333-3333-3333-333333333306',
   'Frontend Phase 1 — Core Pages',
   'Hoàn thành Home, Product List, Product Detail, Cart, và Checkout pages theo Figma.',
   600.00, '2026-05-31', NULL,
   'SUBMITTED', '2026-03-06 09:00:00'),

  ('aab44444-4444-4444-4444-444444444407',
   'aab33333-3333-3333-3333-333333333307',
   'Docker Containerization Complete',
   'Dockerize toàn bộ services: Spring Boot API, React app, PostgreSQL, Nginx reverse proxy. Docker Compose setup.',
   700.00, '2026-06-15', NULL,
   'IN_PROGRESS', '2026-03-15 09:00:00'),

  ('aab44444-4444-4444-4444-444444444408',
   'aab33333-3333-3333-3333-333333333308',
   'PostgreSQL Audit & Index Optimization',
   'Phân tích toàn bộ slow queries, thêm indexes, và tối ưu 20 query quan trọng nhất. Báo cáo before/after.',
   850.00, '2026-06-28', NULL,
   'IN_PROGRESS', '2026-03-19 09:00:00'),

  ('aab44444-4444-4444-4444-444444444409',
   'aab33333-3333-3333-3333-333333333309',
   'Churn Model EDA & Feature Engineering',
   'Exploratory Data Analysis đầy đủ, xử lý missing values, feature engineering, và baseline model với logistic regression.',
   1000.00, '2026-06-30', NULL,
   'IN_PROGRESS', '2026-04-06 09:00:00'),

  ('aab44444-4444-4444-4444-444444444410',
   'aab33333-3333-3333-3333-333333333310',
   'NLP Pipeline Data Prep & Model Training',
   'Thu thập và label training data, train BERT classifier, đánh giá trên validation set, và report metrics chi tiết.',
   800.00, '2026-07-10', NULL,
   'PENDING', '2026-04-15 09:00:00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 7. MESSAGES — 10 tin nhắn giữa client và expert
--    Trải đều trên các project đang ACTIVE (6-10)
-- ============================================================
INSERT INTO messages (id, project_id, sender_id, content, status, created_at)
VALUES
  ('aab55555-5555-5555-5555-555555555501',
   'aab33333-3333-3333-3333-333333333306',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   'Chào bạn, mình đã review Figma prototype rồi. Trang Home trông ổn, nhưng mình muốn section hero có animation slide-in khi load. Bạn có thể thêm được không?',
   'READ', '2026-05-20 09:15:00'),

  ('aab55555-5555-5555-5555-555555555502',
   'aab33333-3333-3333-3333-333333333306',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'Được, mình sẽ dùng Framer Motion để làm animation cho hero section. Sẽ có slide-in từ trái cho heading và fade-up cho subtext. Demo vào thứ 6 nhé?',
   'READ', '2026-05-20 10:30:00'),

  ('aab55555-5555-5555-5555-555555555503',
   'aab33333-3333-3333-3333-333333333307',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'Mình đã hoàn thành Dockerfile cho Spring Boot và React. Hiện đang setup Nginx reverse proxy. Bạn có muốn mình dùng Alpine Linux image để giảm size không?',
   'READ', '2026-05-22 14:00:00'),

  ('aab55555-5555-5555-5555-555555555504',
   'aab33333-3333-3333-3333-333333333307',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   'Ừ, dùng Alpine cho nhẹ. À bạn nhớ setup health check endpoint trong Docker Compose nhé, để sau này deploy ECS dễ hơn.',
   'READ', '2026-05-22 15:20:00'),

  ('aab55555-5555-5555-5555-555555555505',
   'aab33333-3333-3333-3333-333333333308',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   'Bạn ơi, query lấy danh sách đơn hàng theo tháng đang chạy mất 8 giây. Đây là execution plan: [EXPLAIN ANALYZE output]. Bạn xem giúp mình nhé.',
   'READ', '2026-05-25 09:00:00'),

  ('aab55555-5555-5555-5555-555555555506',
   'aab33333-3333-3333-3333-333333333308',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'Mình xem rồi — đang bị sequential scan trên bảng orders 3 triệu rows. Cần thêm composite index (client_id, created_at, status). Mình sẽ test trước trên staging, xuống còn ~200ms.',
   'READ', '2026-05-25 11:30:00'),

  ('aab55555-5555-5555-5555-555555555507',
   'aab33333-3333-3333-3333-333333333309',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'Mình đã hoàn thành EDA. Dataset có 15% missing values ở cột last_login và 8% ở purchase_frequency. Mình sẽ impute bằng median strategy. Bạn có data bổ sung nào không?',
   'READ', '2026-05-26 10:00:00'),

  ('aab55555-5555-5555-5555-555555555508',
   'aab33333-3333-3333-3333-333333333309',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   'Mình có thể cung cấp thêm data từ email campaigns (open rate, click rate). Mình sẽ export CSV và gửi qua Google Drive nhé. Feature này quan trọng cho churn prediction không?',
   'SENT', '2026-05-27 14:00:00'),

  ('aab55555-5555-5555-5555-555555555509',
   'aab33333-3333-3333-3333-333333333310',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   'Update: mình đã label xong 500 tickets đầu tiên với 8 categories. File Google Sheet đã share với bạn. Bạn có thể start training không hay cần thêm data?',
   'READ', '2026-05-28 09:00:00'),

  ('aab55555-5555-5555-5555-555555555510',
   'aab33333-3333-3333-3333-333333333310',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   '500 samples là đủ để start fine-tuning BERT. Mình sẽ train và share kết quả validation accuracy. Nếu < 85% thì cần thêm data. Dự kiến 2 ngày nữa có kết quả nhé.',
   'READ', '2026-05-28 11:30:00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 8. REVIEWS — 10 reviews (5 completed projects × 2 chiều)
--    Client đánh giá Expert + Expert đánh giá Client
-- ============================================================
INSERT INTO reviews (id, giver_id, receiver_id, project_id, rating, comment, created_at)
VALUES
  -- Project 1 (AI Chatbot)
  ('aab66666-6666-6666-6666-666666666601',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'aab33333-3333-3333-3333-333333333301',
   5,
   'Chatbot hoạt động vượt kỳ vọng! Expert giao tiếp chuyên nghiệp, giải thích rõ ràng từng bước. Code sạch, có documentation đầy đủ. Đặc biệt ấn tượng với tốc độ phản hồi của RAG pipeline. Sẽ hợp tác tiếp!',
   '2026-04-27 10:00:00'),

  ('aab66666-6666-6666-6666-666666666602',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   'aab33333-3333-3333-3333-333333333301',
   5,
   'Client rõ ràng về yêu cầu, phản hồi nhanh, và hiểu technical details tốt. Feedback constructive và đúng deadline review. Môi trường hợp tác lý tưởng để làm việc chất lượng cao.',
   '2026-04-27 14:00:00'),

  -- Project 2 (Analytics Dashboard)
  ('aab66666-6666-6666-6666-666666666603',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'aab33333-3333-3333-3333-333333333302',
   5,
   'Dashboard đẹp và dễ dùng, real-time data cập nhật mượt mà. Expert hoàn thành trước deadline 2 ngày và còn thêm tính năng export Excel mà không tính thêm phí. Rất hài lòng!',
   '2026-03-29 10:00:00'),

  ('aab66666-6666-6666-6666-666666666604',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   'aab33333-3333-3333-3333-333333333302',
   4,
   'Dự án thú vị với yêu cầu rõ ràng. Client đôi khi thay đổi scope giữa chừng nhưng luôn thông báo và thương lượng fair. Môi trường làm việc tốt, sẽ nhận dự án tiếp nếu có.',
   '2026-03-29 15:00:00'),

  -- Project 3 (Mobile API)
  ('aab66666-6666-6666-6666-666666666605',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'aab33333-3333-3333-3333-333333333303',
   5,
   'API hoạt động ổn định, test coverage 87%, Swagger docs chi tiết. Expert chủ động suggest best practices về security (rate limiting, JWT refresh token rotation). Đây là level professional thực sự.',
   '2026-04-11 10:00:00'),

  ('aab66666-6666-6666-6666-666666666606',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   'aab33333-3333-3333-3333-333333333303',
   5,
   'Yêu cầu kỹ thuật được định nghĩa rõ từ đầu. Client test kỹ lưỡng và report bugs chính xác. Thanh toán đúng hạn. Đây là client mà developer nào cũng muốn làm việc cùng.',
   '2026-04-11 16:00:00'),

  -- Project 4 (Sentiment Analysis)
  ('aab66666-6666-6666-6666-666666666607',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'aab33333-3333-3333-3333-333333333304',
   4,
   'Model accuracy 91.5% tốt, API response time < 100ms. Có một số edge cases với slang tiếng Việt chưa xử lý tốt nhưng expert đã commit fix trong 1 tuần. Overall rất hài lòng với kết quả.',
   '2026-04-16 10:00:00'),

  ('aab66666-6666-6666-6666-666666666608',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   'aab33333-3333-3333-3333-333333333304',
   5,
   'Client cung cấp dataset chất lượng tốt và label rõ ràng. Feedback về model performance cụ thể và hữu ích. Hiểu trade-off giữa accuracy và latency. Rất chuyên nghiệp.',
   '2026-04-16 14:00:00'),

  -- Project 5 (Recommendation System)
  ('aab66666-6666-6666-6666-666666666609',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'aab33333-3333-3333-3333-333333333305',
   5,
   'Hệ thống recommendation tuyệt vời! Click-through rate tăng 23% sau khi deploy. Expert setup cả A/B testing framework để mình tiếp tục optimize. Đây là investment xứng đáng nhất của năm.',
   '2026-05-11 10:00:00'),

  ('aab66666-6666-6666-6666-666666666610',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'aba3403c-7593-4b9c-9117-f4741858d270',
   'aab33333-3333-3333-3333-333333333305',
   5,
   'Dự án ML phức tạp nhất mình làm trên platform này. Client hiểu business metrics và biết chính xác cần optimize KPI gì. Collaboration từ đầu đến cuối đều smooth. 10/10.',
   '2026-05-11 15:00:00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 9. SERVICES — thêm 8 services (expert đã có 2 → tổng 10)
-- ============================================================
INSERT INTO services (id, expert_id, title, description, price, delivery_days, category, image_url, is_active, created_at)
VALUES
  ('aab77777-7777-7777-7777-777777777701',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'Full-Stack Web App Development (React + Spring Boot)',
   'Phát triển ứng dụng web full-stack hoàn chỉnh với React frontend và Spring Boot backend. Bao gồm authentication, RESTful API, PostgreSQL database, và deploy lên AWS/cloud.',
   3000.00, 30, 'Web Development', NULL, true, '2026-03-01 09:00:00'),

  ('aab77777-7777-7777-7777-777777777702',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'Machine Learning Model Development & Deployment',
   'Xây dựng end-to-end ML pipeline: data preprocessing, feature engineering, model training (scikit-learn/PyTorch), evaluation, và deploy production API với FastAPI/Flask.',
   2500.00, 21, 'Machine Learning', NULL, true, '2026-03-05 09:00:00'),

  ('aab77777-7777-7777-7777-777777777703',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'PostgreSQL Database Design & Optimization',
   'Thiết kế schema chuẩn 3NF, tối ưu query với EXPLAIN ANALYZE, thêm indexes, setup partitioning cho large tables, và implement caching strategy với Redis.',
   800.00, 7, 'Database', NULL, true, '2026-03-10 09:00:00'),

  ('aab77777-7777-7777-7777-777777777704',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'Docker & Kubernetes DevOps Setup',
   'Containerize ứng dụng với Docker, setup Kubernetes cluster, configure CI/CD với GitHub Actions/GitLab CI, monitoring với Prometheus + Grafana, và logging với ELK stack.',
   1800.00, 14, 'DevOps', NULL, true, '2026-03-15 09:00:00'),

  ('aab77777-7777-7777-7777-777777777705',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'AWS Cloud Architecture & Migration',
   'Thiết kế kiến trúc AWS cloud (EC2, ECS, RDS, S3, CloudFront, Route53), migrate ứng dụng on-premise lên cloud, setup auto-scaling, backup, và cost optimization.',
   2200.00, 21, 'Cloud', NULL, true, '2026-03-20 09:00:00'),

  ('aab77777-7777-7777-7777-777777777706',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'React UI/UX Implementation from Figma',
   'Chuyển đổi Figma design sang React code với Tailwind CSS. Pixel-perfect, fully responsive, có animations, dark mode support, và accessibility compliance (WCAG 2.1).',
   1200.00, 14, 'Frontend', NULL, true, '2026-03-25 09:00:00'),

  ('aab77777-7777-7777-7777-777777777707',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'Data Analytics & Business Intelligence Dashboard',
   'Xây dựng BI dashboard với charts tương tác, real-time data updates, drill-down filters, và export reports. Tech: React + Chart.js/Recharts + WebSocket.',
   1500.00, 12, 'Data Analytics', NULL, true, '2026-04-01 09:00:00'),

  ('aab77777-7777-7777-7777-777777777708',
   '3938a7e1-00e6-41fb-80f0-5db12934b7bb',
   'Spring Boot REST API with Microservices',
   'Phát triển microservices với Spring Boot, Spring Cloud (Eureka, Gateway, Config Server), JWT authentication, message queue (RabbitMQ/Kafka), và API documentation với Swagger.',
   2000.00, 18, 'Backend', NULL, true, '2026-04-05 09:00:00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 10. SERVICE_TAGS — tags cho 8 services mới
-- ============================================================
INSERT INTO service_tags (service_id, tag) VALUES
  ('aab77777-7777-7777-7777-777777777701', 'react'),
  ('aab77777-7777-7777-7777-777777777701', 'spring-boot'),
  ('aab77777-7777-7777-7777-777777777701', 'full-stack'),
  ('aab77777-7777-7777-7777-777777777701', 'postgresql'),

  ('aab77777-7777-7777-7777-777777777702', 'machine-learning'),
  ('aab77777-7777-7777-7777-777777777702', 'python'),
  ('aab77777-7777-7777-7777-777777777702', 'fastapi'),
  ('aab77777-7777-7777-7777-777777777702', 'pytorch'),

  ('aab77777-7777-7777-7777-777777777703', 'postgresql'),
  ('aab77777-7777-7777-7777-777777777703', 'database'),
  ('aab77777-7777-7777-7777-777777777703', 'optimization'),

  ('aab77777-7777-7777-7777-777777777704', 'docker'),
  ('aab77777-7777-7777-7777-777777777704', 'kubernetes'),
  ('aab77777-7777-7777-7777-777777777704', 'devops'),
  ('aab77777-7777-7777-7777-777777777704', 'ci-cd'),

  ('aab77777-7777-7777-7777-777777777705', 'aws'),
  ('aab77777-7777-7777-7777-777777777705', 'cloud'),
  ('aab77777-7777-7777-7777-777777777705', 'terraform'),
  ('aab77777-7777-7777-7777-777777777705', 'infrastructure'),

  ('aab77777-7777-7777-7777-777777777706', 'react'),
  ('aab77777-7777-7777-7777-777777777706', 'tailwind'),
  ('aab77777-7777-7777-7777-777777777706', 'figma'),
  ('aab77777-7777-7777-7777-777777777706', 'frontend'),

  ('aab77777-7777-7777-7777-777777777707', 'dashboard'),
  ('aab77777-7777-7777-7777-777777777707', 'analytics'),
  ('aab77777-7777-7777-7777-777777777707', 'react'),
  ('aab77777-7777-7777-7777-777777777707', 'data-visualization'),

  ('aab77777-7777-7777-7777-777777777708', 'spring-boot'),
  ('aab77777-7777-7777-7777-777777777708', 'microservices'),
  ('aab77777-7777-7777-7777-777777777708', 'java'),
  ('aab77777-7777-7777-7777-777777777708', 'kafka')
ON CONFLICT DO NOTHING;

-- ============================================================
-- Verification queries
-- ============================================================
SELECT 'user_skills (client+expert)' AS tbl, count(*) FROM user_skills
  WHERE user_id IN ('aba3403c-7593-4b9c-9117-f4741858d270','3938a7e1-00e6-41fb-80f0-5db12934b7bb')
UNION ALL
SELECT 'job_posts (client)', count(*) FROM job_posts
  WHERE client_id = 'aba3403c-7593-4b9c-9117-f4741858d270'
UNION ALL
SELECT 'proposals (expert→client jobs)', count(*) FROM proposals p
  JOIN job_posts j ON j.id = p.job_id
  WHERE p.expert_id = '3938a7e1-00e6-41fb-80f0-5db12934b7bb'
    AND j.client_id = 'aba3403c-7593-4b9c-9117-f4741858d270'
UNION ALL
SELECT 'projects (client+expert)', count(*) FROM projects
  WHERE client_id = 'aba3403c-7593-4b9c-9117-f4741858d270'
    AND expert_id = '3938a7e1-00e6-41fb-80f0-5db12934b7bb'
UNION ALL
SELECT 'milestones (client+expert projects)', count(*) FROM milestones m
  JOIN projects p ON p.id = m.project_id
  WHERE p.client_id = 'aba3403c-7593-4b9c-9117-f4741858d270'
    AND p.expert_id = '3938a7e1-00e6-41fb-80f0-5db12934b7bb'
UNION ALL
SELECT 'messages (client+expert projects)', count(*) FROM messages msg
  JOIN projects p ON p.id = msg.project_id
  WHERE p.client_id = 'aba3403c-7593-4b9c-9117-f4741858d270'
    AND p.expert_id = '3938a7e1-00e6-41fb-80f0-5db12934b7bb'
UNION ALL
SELECT 'reviews (client↔expert)', count(*) FROM reviews
  WHERE (giver_id = 'aba3403c-7593-4b9c-9117-f4741858d270' OR giver_id = '3938a7e1-00e6-41fb-80f0-5db12934b7bb')
    AND (receiver_id = 'aba3403c-7593-4b9c-9117-f4741858d270' OR receiver_id = '3938a7e1-00e6-41fb-80f0-5db12934b7bb')
UNION ALL
SELECT 'services (expert)', count(*) FROM services
  WHERE expert_id = '3938a7e1-00e6-41fb-80f0-5db12934b7bb';