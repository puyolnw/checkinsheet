import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const ModernLanding: React.FC = () => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'บันทึกการฝึกปฏิบัติ',
      description: 'นักศึกษาสามารถบันทึกกิจกรรมการฝึกปฏิบัติได้อย่างเป็นระบบ พร้อมติดตามความก้าวหน้า'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'ระบบประเมิน',
      description: 'ครูพี่เลี้ยงและอาจารย์นิเทศสามารถประเมินนักศึกษาได้อย่างครอบคลุมและเป็นระบบ'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'การสื่อสาร',
      description: 'ระบบแชทและข้อความที่ช่วยให้การสื่อสารระหว่างผู้เกี่ยวข้องเป็นไปอย่างราบรื่น'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'รายงานและสถิติ',
      description: 'สร้างรายงานและดูสถิติการฝึกปฏิบัติได้อย่างละเอียดและครบถ้วน'
    }
  ];

  const stats = [
    { label: 'นักศึกษา', value: '500+', icon: '👨‍🎓' },
    { label: 'ครูพี่เลี้ยง', value: '200+', icon: '👩‍🏫' },
    { label: 'โรงเรียน', value: '50+', icon: '🏫' },
    { label: 'อาจารย์นิเทศ', value: '30+', icon: '👨‍💼' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge variant="info" className="mb-6">
              🎓 ระบบฝึกประสบการณ์วิชาชีพครู
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              จัดการการฝึกประสบการณ์
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                วิชาชีพครู
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              ระบบสารสนเทศที่ช่วยให้นักศึกษา ครูพี่เลี้ยง และอาจารย์นิเทศ 
              สามารถทำงานร่วมกันได้อย่างมีประสิทธิภาพและเป็นระบบ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  เข้าสู่ระบบ
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  สมัครสมาชิก
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ฟีเจอร์หลักของระบบ
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ระบบที่ออกแบบมาเพื่อตอบสนองความต้องการของทุกฝ่ายที่เกี่ยวข้อง
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center">
                <CardContent>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            พร้อมเริ่มต้นแล้วหรือยัง?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            เข้าร่วมกับระบบฝึกประสบการณ์วิชาชีพครูที่ทันสมัยและใช้งานง่าย
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                เข้าสู่ระบบ
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-blue-600">
                ติดต่อเรา
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ความคิดเห็นจากผู้ใช้งาน
            </h2>
            <p className="text-xl text-gray-600">
              ผู้ใช้งานจริงพูดถึงระบบของเรา
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'นางสาวสมใจ ใจดี',
                role: 'นักศึกษาฝึกประสบการณ์',
                content: 'ระบบใช้งานง่ายมาก ช่วยให้การบันทึกการฝึกปฏิบัติเป็นระเบียบและครบถ้วน',
                avatar: '👩‍🎓'
              },
              {
                name: 'นายวิชัย ครูดี',
                role: 'ครูพี่เลี้ยง',
                content: 'สามารถประเมินนักศึกษาได้อย่างเป็นระบบ และติดตามความก้าวหน้าได้ดี',
                avatar: '👨‍🏫'
              },
              {
                name: 'ผศ.ดร.สมชาย ใจงาม',
                role: 'อาจารย์นิเทศ',
                content: 'ระบบช่วยให้การนิเทศและการประเมินเป็นไปอย่างมีประสิทธิภาพ',
                avatar: '👨‍💼'
              }
            ].map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardContent>
                  <div className="text-4xl mb-4">{testimonial.avatar}</div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernLanding;
