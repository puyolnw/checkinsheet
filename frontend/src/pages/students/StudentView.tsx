import React from 'react';
import { useParams } from 'react-router-dom';

const StudentView: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ข้อมูลนักศึกษา</h1>
        <p className="text-gray-600">ดูข้อมูลนักศึกษา ID: {id}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">หน้ารายละเอียดนักศึกษา - กำลังพัฒนา</p>
      </div>
    </div>
  );
};

export default StudentView;
