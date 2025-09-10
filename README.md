# ระบบสารสนเทศนักศึกษาฝึกประสบการณ์วิชาชีพครู

ระบบจัดการการฝึกประสบการณ์วิชาชีพครูสำหรับนักศึกษา สาขาบรรณารักษ์ศึกษา-ภาษาอังกฤษ คณะครุศาสตร์ มหาวิทยาลัยราชภัฏมหาสารคาม

## 🛠 Tech Stack

- **Backend**: Node.js + Express.js + MySQL
- **Frontend**: Vite + React + TypeScript (.tsx)
- **Database**: MySQL (ผ่าน AppServ/XAMPP)
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Tailwind CSS

## 👥 User Roles

1. **นักศึกษา** (Student) - ผู้เข้าร่วมการฝึกประสบการณ์วิชาชีพครู
2. **แอดมิน** (Admin) - ผู้ดูแลระบบ
3. **ครูพี่เลี้ยง** (Mentor Teacher) - ครูในโรงเรียนที่ให้คำปรึกษาและดูแลนักศึกษา
4. **อาจารย์นิเทศ/ครูแนะแนว** (Supervisor) - อาจารย์ที่รับผิดชอบดูแลนักศึกษา

## 🚀 การติดตั้งและรันโปรเจค

### ข้อกำหนดเบื้องต้น

- Node.js (v16 หรือใหม่กว่า)
- MySQL (v8.0 หรือใหม่กว่า)
- npm หรือ yarn

### 1. ติดตั้งฐานข้อมูล

1. ติดตั้ง AppServ หรือ XAMPP
2. เปิด phpMyAdmin
3. สร้างฐานข้อมูลใหม่ชื่อ `student_practicum_system`
4. Import ไฟล์ `student_practicum_system.sql` ที่ให้ไว้

### 2. ติดตั้ง Backend

```bash
# เข้าไปในโฟลเดอร์ backend
cd backend

# ติดตั้ง dependencies
npm install

# สร้างไฟล์ .env (คัดลอกจาก .env.example)
# แก้ไขการตั้งค่าฐานข้อมูลตามที่เหมาะสม
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_practicum_system
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# รันเซิร์ฟเวอร์
npm start
```

### 3. ติดตั้ง Frontend

```bash
# เข้าไปในโฟลเดอร์ frontend
cd frontend

# ติดตั้ง dependencies
npm install

# สร้างไฟล์ .env
echo "VITE_API_URL=http://localhost:5000/api" > .env

# รันแอปพลิเคชัน
npm run dev
```

## 📁 โครงสร้างโปรเจค

```
project-root/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   ├── routes/
│   │   │   └── auth.js
│   │   └── utils/
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layouts/
│   │   │   │   ├── GuestLayout.tsx
│   │   │   │   └── AuthenticatedLayout.tsx
│   │   │   ├── common/
│   │   │   └── ui/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   └── Login.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── Dashboard.tsx
│   │   │   └── Landing.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── App.tsx
│   └── package.json
├── student_practicum_system.sql
├── tasks_md.md
└── README.md
```

## 🔐 ข้อมูลทดสอบ

### บัญชีผู้ใช้ทดสอบ

| บทบาท | ชื่อผู้ใช้ | รหัสผ่าน | อีเมล |
|--------|-----------|----------|-------|
| แอดมิน | admin | password | admin@rmu.ac.th |
| นักศึกษา | student001 | password | student001@rmu.ac.th |
| ครูพี่เลี้ยง | mentor001 | password | mentor001@school.ac.th |
| อาจารย์นิเทศ | supervisor1 | password | supervisor1@rmu.ac.th |

## 🌐 URL และ Port

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 📋 ฟีเจอร์ที่พร้อมใช้งาน

### ✅ ที่เสร็จแล้ว

- [x] ระบบ Authentication (Login/Logout)
- [x] ระบบจัดการผู้ใช้ตาม Role
- [x] Layout สำหรับ Guest และ Authenticated users
- [x] Dashboard พื้นฐาน
- [x] ระบบ Navigation และ Sidebar
- [x] การจัดการ State ด้วย Context API
- [x] API Service Layer
- [x] TypeScript Types
- [x] Responsive Design

### 🚧 กำลังพัฒนา

- [ ] ระบบจัดการข้อมูลนักศึกษา
- [ ] ระบบจัดการข้อมูลโรงเรียน
- [ ] ระบบจัดการข้อมูลครูพี่เลี้ยง
- [ ] ระบบจัดการข้อมูลอาจารย์นิเทศ
- [ ] ระบบบันทึกการฝึกปฏิบัติ
- [ ] ระบบประเมิน
- [ ] ระบบข้อความ
- [ ] ระบบประกาศข่าวสาร
- [ ] ระบบรายงาน

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - เข้าสู่ระบบ
- `GET /api/auth/profile` - ดูข้อมูลโปรไฟล์
- `POST /api/auth/logout` - ออกจากระบบ
- `PUT /api/auth/change-password` - เปลี่ยนรหัสผ่าน

### Health Check
- `GET /api/health` - ตรวจสอบสถานะ API

## 🎨 UI/UX Features

- **Responsive Design**: รองรับการใช้งานบน Desktop, Tablet และ Mobile
- **Dark/Light Mode**: (วางแผนไว้)
- **Thai Language Support**: รองรับภาษาไทยเต็มรูปแบบ
- **Modern UI**: ใช้ Tailwind CSS สำหรับการออกแบบ
- **Accessibility**: รองรับการใช้งานสำหรับผู้พิการ

## 🔒 Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- CORS Protection
- Helmet Security Headers
- Input Validation
- SQL Injection Protection

## 📱 Mobile Support

ระบบรองรับการใช้งานบนอุปกรณ์มือถือและแท็บเล็ต โดยมี:
- Responsive Layout
- Touch-friendly Interface
- Mobile Navigation
- Optimized Performance

## 🚀 Deployment

### Development
```bash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm run dev
```

### Production
```bash
# Build Frontend
cd frontend && npm run build

# Start Backend in Production
cd backend && NODE_ENV=production npm start
```

## 🤝 การมีส่วนร่วม

1. Fork โปรเจค
2. สร้าง Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add some AmazingFeature'`)
4. Push ไปยัง Branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

## 📞 ติดต่อ

- **มหาวิทยาลัย**: มหาวิทยาลัยราชภัฏมหาสารคาม
- **คณะ**: คณะครุศาสตร์
- **สาขา**: บรรณารักษ์ศึกษา-ภาษาอังกฤษ
- **อีเมล**: info@rmu.ac.th

## 📄 License

โปรเจคนี้อยู่ภายใต้ MIT License - ดูไฟล์ [LICENSE](LICENSE) สำหรับรายละเอียด

## 🙏 ขอบคุณ

ขอบคุณทุกท่านที่ให้การสนับสนุนและข้อเสนอแนะในการพัฒนาระบบนี้

---

**หมายเหตุ**: ระบบนี้อยู่ในระหว่างการพัฒนา ฟีเจอร์บางส่วนอาจยังไม่สมบูรณ์
#   c h e c k i n s h e e t  
 