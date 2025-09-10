import React from 'react';
import { useParams } from 'react-router-dom';

const MentorView: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ข้อมูลครูพี่เลี้ยง</h1>
        <p className="text-gray-600">ดูข้อมูลครูพี่เลี้ยง ID: {id}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">หน้ารายละเอียดครูพี่เลี้ยง - กำลังพัฒนา</p>
      </div>
    </div>
  );
};

export default MentorView;
