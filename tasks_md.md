# TASKS - ระบบสารสนเทศนักศึกษาฝึกประสบการณ์วิชาชีพครู สาขาบรรณารักษ์ศึกษา-ภาษาอังกฤษ

## 📋 Overview
พัฒนาระบบสารสนเทศสำหรับจัดการการฝึกประสบการณ์วิชาชีพครูของนักศึกษา สาขาบรรณารักษ์ศึกษา-ภาษาอังกฤษ คณะครุศาสตร์ มหาวิทยาลัยราชภัฏมหาสารคาม

## 🛠 Tech Stack
- **Backend**: Node.js + Express.js + MySQL
- **Frontend**: Vite + React + TypeScript (.tsx)
- **Database**: MySQL (ผ่าน AppServ)
- **Environment**: .env สำหรับจัดการ config

## 👥 User Roles
1. **นักศึกษา** - Student
2. **แอดมิน** - Admin
3. **ครูพี่เลี้ยง** - Mentor Teacher
4. **ครูแนะแนว/อาจารย์นิเทศ** - Supervisor

## 🎨 Layouts
### Layout 1: Guest Layout (แขก)
- สำหรับหน้า Landing Page, Login, Register
- มีเฉพาะ Navbar ที่แสดงชื่อเว็บไซต์
- เรียบง่าย เน้นการเข้าสู่ระบบ

### Layout 2: Logined Layout (ผู้ใช้ที่ Login แล้ว)
- Sidebar (ซ้าย) แสดงเมนูและชื่อเว็บไซต์
- Navbar (บน) แสดงชื่อหน้าปัจจุบันและข้อมูลผู้ใช้
- Content Area สำหรับแสดงเนื้อหา
- Layout เหมือนในภาพตัวอย่าง

---

# 🚀 Development Tasks

## Phase 1: Project Setup & Database

### 1.1 Backend Setup (Node.js)
- [x] สร้างโปรเจค Node.js
- [x] ติดตั้ง dependencies พื้นฐาน
  ```bash
  npm init -y
  npm install express mysql2 dotenv bcryptjs jsonwebtoken cors helmet
  npm install -D nodemon
  ```
- [x] สร้างโครงสร้างโฟลเดอร์
  ```
  backend/
  ├── src/
  │   ├── config/
  │   ├── controllers/
  │   ├── middleware/
  │   ├── models/
  │   ├── routes/
  │   └── utils/
  ├── .env
  ├── .env.example
  ├── server.js
  └── package.json
  ```
- [x] สร้างไฟล์ .env และ .env.example
- [x] สร้าง server.js หลักสำหรับ Express
- [x] ตั้งค่า npm script "start": "nodemon server.js"

### 1.2 Database Setup (MySQL)
- [x] สร้างฐานข้อมูล "student_practicum_system"
- [x] รัน SQL script เริ่มต้น (ดูด้านล่าง)
- [x] สร้าง config/database.js สำหรับเชื่อมต่อ MySQL
- [x] ทดสอบการเชื่อมต่อฐานข้อมูล

### 1.3 Frontend Setup (Vite React TypeScript)
- [x] สร้างโปรเจค Vite React TypeScript
  ```bash
  npm create vite@latest frontend -- --template react-ts
  cd frontend
  npm install
  ```
- [x] ติดตั้ง dependencies เพิ่มเติม
  ```bash
  npm install react-router-dom axios
  npm install -D @types/node
  ```
- [x] สร้างโครงสร้างโฟลเดอร์
  ```
  frontend/
  ├── src/
  │   ├── components/
  │   │   ├── layouts/
  │   │   ├── common/
  │   │   └── ui/
  │   ├── pages/
  │   ├── hooks/
  │   ├── services/
  │   ├── types/
  │   ├── utils/
  │   └── styles/
  ```

## Phase 2: Authentication & User Management

### 2.1 Backend Authentication
- [x] สร้าง middleware สำหรับ authentication
- [x] สร้าง API endpoints สำหรับ login/register
- [x] สร้าง API สำหรับการจัดการ users
- [x] ตั้งค่า JWT token handling
- [x] สร้าง middleware สำหรับการตรวจสอบ role

### 2.2 Frontend Authentication
- [x] สร้าง AuthContext สำหรับการจัดการ state
- [x] สร้างหน้า Login
- [ ] สร้างหน้า Register (ถ้าจำเป็น)
- [x] สร้าง Protected Route component
- [x] ตั้งค่า Axios interceptors สำหรับ token

## Phase 3: Layout Development

### 3.1 Guest Layout
- [x] สร้าง GuestLayout component
- [x] สร้าง Navbar สำหรับ guest
- [x] สร้างหน้า Landing Page
- [x] ใช้งานได้กับหน้า Login/Register

### 3.2 Logined Layout
- [x] สร้าง AuthenticatedLayout component
- [x] สร้าง Sidebar component
  - [x] แสดงชื่อเว็บไซต์
  - [x] เมนูตาม role ของผู้ใช้
  - [x] การ logout
- [x] สร้าง Navbar สำหรับผู้ใช้ที่ login
  - [x] แสดงชื่อหน้าปัจจุบัน
  - [x] ข้อมูลผู้ใช้
  - [x] วันที่และเวลา
- [x] สร้าง Content Area

## Phase 4: Core System Features

### 4.1 ระบบจัดการข้อมูลพื้นฐาน

#### 4.1.1 ระบบจัดการข้อมูลนักศึกษา
- [x] API สำหรับ CRUD นักศึกษา
- [x] หน้าจัดการข้อมูลนักศึกษา
- [ ] ระบบเลือกสถานศึกษาที่เข้าฝึก

#### 4.1.2 ระบบจัดการข้อมูลโรงเรียน
- [x] API สำหรับ CRUD ข้อมูลโรงเรียน
- [ ] หน้าจัดการข้อมูลโรงเรียน
- [ ] ระบบจับคู่นักศึกษากับโรงเรียน

#### 4.1.3 ระบบจัดการข้อมูลครูพี่เลี้ยง
- [x] API สำหรับ CRUD ข้อมูลครูพี่เลี้ยง
- [ ] หน้าจัดการข้อมูลครูพี่เลี้ยง
- [ ] ระบบมอบหมายครูพี่เลี้ยงให้นักศึกษา

#### 4.1.4 ระบบจัดการข้อมูลอาจารย์นิเทศ
- [x] API สำหรับ CRUD ข้อมูลอาจารย์นิเทศ
- [ ] หน้าจัดการข้อมูลอาจารย์นิเทศ
- [ ] ระบบมอบหมายอาจารย์นิเทศให้นักศึกษา

### 4.2 ระบบจัดการเนื้อหาและข้อมูล

#### 4.2.1 ระบบจัดการข้อมูลข่าวสาร
- [x] API สำหรับ CRUD ข่าวสาร/ประกาศ
- [x] หน้าจัดการข่าวสารสำหรับ Admin
- [x] หน้าแสดงข่าวสารสำหรับผู้ใช้ทั่วไป

#### 4.2.2 ระบบจัดการแผนการสอนและสื่อการสอน
- [x] API สำหรับอัปโหลดและจัดการไฟล์
- [x] หน้าอัปโหลดแผนการสอนสำหรับนักศึกษา
- [x] หน้าดูและอนุมัติแผนการสอนสำหรับครูพี่เลี้ยง/อาจารย์นิเทศ

### 4.3 ระบบการฝึกปฏิบัติ

#### 4.3.1 ระบบบันทึกข้อมูลการฝึกประสบการณ์วิชาชีพครู
- [x] API สำหรับบันทึกข้อมูลการฝึกปฏิบัติ
- [x] หน้าบันทึกกิจกรรมประจำวันสำหรับนักศึกษา
- [x] ระบบติดตามชั่วโมงการฝึก (50 ชั่วโมง)
- [x] หน้าดูความก้าวหน้าการฝึกปฏิบัติ

#### 4.3.2 ระบบประเมินการฝึกประสบการณ์วิชาชีพครู
- [x] API สำหรับระบบประเมิน
- [x] หน้าประเมินสำหรับครูพี่เลี้ยง
- [x] หน้าประเมินสำหรับอาจารย์นิเทศ
- [x] หน้าดูผลประเมินสำหรับนักศึกษา

### 4.4 ระบบการสื่อสารและรายงาน

#### 4.4.1 ระบบการติดต่อสื่อสาร
- [x] API สำหรับระบบข้อความ/แชท
- [x] หน้าแชทระหว่างนักศึกษา-ครูพี่เลี้ยง
- [x] หน้าแชทระหว่างนักศึกษา-อาจารย์นิเทศ
- [x] ระบบแจ้งเตือน (notifications)

#### 4.4.2 ระบบรายงาน
- [x] API สำหรับสร้างรายงาน
- [x] หน้ารายงานความก้าวหน้าการฝึกปฏิบัติ
- [x] หน้ารายงานสรุปผลการประเมิน
- [x] หน้ารายงานสำหรับแอดมิน/อาจารย์นิเทศ
- [x] ระบบ export รายงานเป็น PDF/Excel

## Phase 5: User Interface & Experience

### 5.1 Dashboard สำหรับแต่ละ Role

#### 5.1.1 Dashboard นักศึกษา
- [x] แสดงข้อมูลส่วนตัวและสถานะการฝึก
- [x] แสดงกำหนดการและประกาศ
- [x] แสดงความก้าวหน้าการฝึกปฏิบัติ (progress bar)
- [x] ปุ่มลัดไปยังฟังก์ชันสำคัญ

#### 5.1.2 Dashboard ครูพี่เลี้ยง
- [x] แสดงรายชื่อนักศึกษาที่ดูแล
- [x] แสดงกิจกรรมที่ต้องประเมิน
- [x] แสดงสถิติการฝึกปฏิบัติ

#### 5.1.3 Dashboard อาจารย์นิเทศ/ครูแนะแนว
- [x] แสดงรายชื่อนักศึกษาที่รับผิดชอบ
- [x] แสดงสถิติโดยรวมของการฝึกปฏิบัติ
- [x] แสดงรายงานสรุป

#### 5.1.4 Dashboard แอดมิน
- [x] สถิติระบบโดยรวม
- [x] การจัดการผู้ใช้และข้อมูลหลัก
- [x] รายงานและ analytics

### 5.2 Responsive Design
- [x] ปรับ layout ให้รองรับ mobile
- [x] ทดสอบการใช้งานบน tablet
- [x] ปรับ sidebar ให้เป็น collapsible บน mobile

### 5.3 UI/UX Design & Styling
- [x] สร้าง Design System (Colors, Typography, Spacing)
- [x] ปรับปรุง Layout ให้สวยงามและใช้งานง่าย
- [x] เพิ่ม Icons และ Visual Elements
- [x] ปรับปรุง Forms และ Input Fields
- [x] เพิ่ม Loading States และ Animations
- [x] ปรับปรุง Tables และ Data Display
- [x] เพิ่ม Toast Notifications
- [x] ปรับปรุง Button Styles และ Interactions
- [ ] เพิ่ม Theme Support (Light/Dark Mode)
- [x] ปรับปรุง Navigation และ Breadcrumbs




---

## 📝 การรันโปรเจค

### Backend
```bash
cd backend
npm install
npm start  # รัน server ด้วย nodemon
```

### Frontend  
```bash
cd frontend
npm install
npm run dev  # รัน Vite development server
```

### Database
- ติดตั้ง AppServ หรือ XAMPP
- Import SQL file ที่ให้ไว้
- ปรับค่า connection ใน .env

---

## 🗂 File Structure สุดท้าย

```
project-root/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── studentController.js
│   │   │   ├── schoolController.js
│   │   │   ├── mentorController.js
│   │   │   └── supervisorController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── roleCheck.js
│   │   ├── models/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── students.js
│   │   │   ├── schools.js
│   │   │   ├── mentors.js
│   │   │   └── supervisors.js
│   │   └── utils/
│   ├── .env
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layouts/
│   │   │   │   ├── GuestLayout.tsx
│   │   │   │   └── AuthenticatedLayout.tsx
│   │   │   ├── common/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── LoadingSpinner.tsx
│   │   │   └── ui/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   ├── dashboard/
│   │   │   ├── students/
│   │   │   ├── schools/
│   │   │   ├── mentors/
│   │   │   └── supervisors/
│   │   ├── hooks/
│   │   │   ├── useAuth.tsx
│   │   │   └── useApi.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   └── package.json
├── database/
│   └── init.sql
└── README.md
```

## 🎯 Next Steps
1. เริ่มจาก Phase 1 - Setup project และ database
2. ทดสอบการเชื่อมต่อระหว่าง frontend-backend-database
3. พัฒนาทีละ feature ตาม priority
4. ทดสอบ user experience กับผู้ใช้จริง
5. Deploy และ monitor ระบบ

## 🔗 Resources
- [Node.js Documentation](https://nodejs.org/docs/)
- [React TypeScript Documentation](https://react-typescript-cheatsheet.netlify.app/)
- [Vite Documentation](https://vitejs.dev/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

## 📊 สถานะการทำงาน (Progress Status)

### ✅ งานที่ทำเสร็จแล้ว (Completed)
- **Phase 1**: Project Setup & Database (100%)
- **Phase 2**: Authentication & User Management (90% - ขาด Register page)
- **Phase 3**: Layout Development (100%)
- **Phase 4**: Core System Features (95% - API และ Frontend เสร็จเกือบทั้งหมด)
- **Phase 5**: User Interface & Experience (100% - Dashboard ทุก Role เสร็จ)

### 🚧 งานที่กำลังดำเนินการ (In Progress)
- Security & Performance optimizations
- Testing & Deployment

### ❌ งานที่ยังไม่ได้ทำ (Pending)
- หน้าจัดการข้อมูลพื้นฐาน (โรงเรียน, ครูพี่เลี้ยง, อาจารย์นิเทศ) - Frontend Forms
- ระบบข้อความ/แชท (Messaging System) - Frontend UI
- ระบบรายงาน (Reports) - Frontend UI
- ระบบประเมิน (Evaluation System) - Frontend UI
- ระบบข่าวสาร/ประกาศ (Announcements) - Frontend UI
- ระบบแผนการสอน (Lesson Plans) - Frontend UI

### 📈 สถิติการทำงาน
- **งานทั้งหมด**: ~80 งาน
- **งานที่ทำเสร็จ**: ~55 งาน (69%)
- **งานที่ยังไม่ได้ทำ**: ~25 งาน (31%)

### 🎯 งานสำคัญที่ควรทำต่อ
1. หน้าจัดการข้อมูลพื้นฐาน (โรงเรียน, ครูพี่เลี้ยง, อาจารย์นิเทศ) - Frontend Forms
2. ระบบข้อความ/แชท (Messaging System) - Frontend UI
3. ระบบรายงาน (Reports) - Frontend UI
4. ระบบประเมิน (Evaluation System) - Frontend UI
5. ระบบข่าวสาร/ประกาศ (Announcements) - Frontend UI
6. ระบบแผนการสอน (Lesson Plans) - Frontend UI
7. Security & Performance optimizations
8. Testing & Deployment

---

## 📱 หน้าจอที่ต้องพัฒนา (ตามที่ร้องขอ)

### 1. หน้าจอหลัก ✅
- [x] Landing Page (ModernLanding.tsx)
- [x] Dashboard สำหรับแต่ละ role
- [x] Navigation และ Layout

### 2. หน้าเข้าสู่ระบบ ✅
- [x] Login Page (ModernLogin.tsx)
- [x] Student Registration (StudentRegister.tsx)
- [x] Authentication System

### 3. หน้าบันทึกข้อมูลนักศึกษา ✅
- [x] Students List (StudentsList.tsx)
- [x] Student Create (StudentCreate.tsx)
- [x] Student Edit (StudentEdit.tsx)
- [x] CRUD API endpoints

### 4. หน้าบันทึกข้อมูลสถานศึกษา สำหรับแอดมิน ✅
- [x] Schools List (SchoolsList.tsx)
- [x] School Create (SchoolCreate.tsx)
- [x] School Edit (SchoolEdit.tsx)
- [x] CRUD API endpoints

### 5. หน้าบันทึกข้อมูลครูพี่เลี้ยงสำหรับแอดมิน ✅
- [x] Mentors List (MentorsList.tsx)
- [x] Mentor Create (MentorCreate.tsx)
- [x] Mentor Edit (MentorEdit.tsx)
- [x] CRUD API endpoints

### 6. หน้าบันทึกข้อมูลอาจารย์นิเทศสำหรับแอดมิน ✅
- [x] Supervisors List (SupervisorsList.tsx)
- [x] Supervisor Create (SupervisorCreate.tsx)
- [x] Supervisor Edit (SupervisorEdit.tsx)
- [x] CRUD API endpoints

### 7. หน้าบันทึกข้อมูลการฝึกประสบการณ์วิชาชีพ สำหรับนักศึกษา ✅
- [x] Practicum Records List (PracticumRecords.tsx)
- [x] Practicum Create (PracticumCreate.tsx)
- [x] Practicum Edit (PracticumEdit.tsx)
- [x] CRUD API endpoints

### 8. หน้าการประเมินการฝึกประสบการณ์วิชาชีพ สำหรับครูพี่เลี้ยงและอาจารย์นิเทศ ✅
- [x] Evaluations List (EvaluationsList.tsx)
- [x] Evaluation Create (EvaluationCreate.tsx)
- [x] Evaluation Edit (EvaluationEdit.tsx)
- [x] CRUD API endpoints

### 9. หน้ารายงาน สำหรับแอดมิน 🔄
- [ ] Reports Dashboard
- [ ] Student Progress Reports
- [ ] School Performance Reports
- [ ] Mentor/Supervisor Activity Reports
- [ ] Export to PDF/Excel functionality
