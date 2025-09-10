# ระบบฝึกประสบการณ์วิชาชีพครู - Frontend

## 🚀 การติดตั้งและรัน

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รัน Development Server
```bash
npm run dev
```

### 3. Build สำหรับ Production
```bash
npm run build
```

## 🛠️ Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP Client

## 📁 โครงสร้างโปรเจค

```
src/
├── components/
│   ├── layouts/          # Layout components
│   └── ui/              # Reusable UI components
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── services/            # API services
├── types/               # TypeScript type definitions
└── styles/              # CSS files
```

## 🎨 UI Components

- **Button** - ปุ่มต่างๆ พร้อม variants
- **Input** - Input fields พร้อม validation
- **Card** - Card components
- **Badge** - Status badges
- **Toast** - Notification system

## 🔧 VS Code Extensions

แนะนำให้ติดตั้ง extensions ต่อไปนี้:

1. **Tailwind CSS IntelliSense** - `bradlc.vscode-tailwindcss`
2. **Prettier** - `esbenp.prettier-vscode`
3. **TypeScript** - `ms-vscode.vscode-typescript-next`

## 🌐 การเข้าถึง

- **Development**: http://localhost:5173
- **Production**: Build แล้ว deploy ไปยัง web server

## 📱 Responsive Design

ระบบรองรับการใช้งานบน:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🎯 Features

- ✅ Modern UI/UX Design
- ✅ Responsive Layout
- ✅ Role-based Navigation
- ✅ Authentication System
- ✅ Dashboard สำหรับแต่ละ Role
- ✅ Form Validation
- ✅ Loading States
- ✅ Error Handling