-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 10, 2025 at 08:07 PM
-- Server version: 8.0.17
-- PHP Version: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `student_practicum_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `announcement_type` enum('news','announcement','urgent','general') COLLATE utf8mb4_unicode_ci DEFAULT 'general',
  `target_audience` enum('all','students','mentors','supervisors','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'all',
  `is_published` tinyint(1) DEFAULT '0',
  `publish_date` timestamp NULL DEFAULT NULL,
  `expiry_date` timestamp NULL DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `attachment_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `view_count` int(11) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `announcement_type`, `target_audience`, `is_published`, `publish_date`, `expiry_date`, `created_by`, `attachment_file`, `view_count`, `created_at`) VALUES
(1, 'ประกาศเปิดลงทะเบียนฝึกประสบการณ์วิชาชีพครู', 'ประกาศให้นักศึกษาปี 4 ลงทะเบียนฝึกประสบการณ์วิชาชีพครู ภาคเรียนที่ 2 ปีการศึกษา 2567 ระหว่างวันที่ 15-30 มกราคม 2568', 'announcement', 'students', 1, '2025-09-10 16:57:21', NULL, 1, NULL, 0, '2025-09-10 16:57:21'),
(2, 'คู่มือการฝึกประสบการณ์วิชาชีพครู', 'คู่มือสำหรับนักศึกษาและครูพี่เลี้ยงในการดำเนินงานฝึกประสบการณ์วิชาชีพครู ประจำปีการศึกษา 2567', 'general', 'all', 1, '2025-09-10 16:57:21', NULL, 1, NULL, 0, '2025-09-10 16:57:21'),
(3, 'กำหนดการนิเทศการฝึกประสบการณ์', 'กำหนดการเยี่ยมนิเทศนักศึกษาฝึกประสบการณ์วิชาชีพครู เดือนกุมภาพันธ์ 2568', 'news', 'all', 1, '2025-09-10 16:57:21', NULL, 1, NULL, 0, '2025-09-10 16:57:21');

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `uploaded_by` int(11) NOT NULL,
  `document_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` int(11) NOT NULL,
  `document_category` enum('lesson_plan','report','form','attachment','other') COLLATE utf8mb4_unicode_ci DEFAULT 'other',
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_public` tinyint(1) DEFAULT '0',
  `download_count` int(11) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `evaluations`
--

CREATE TABLE `evaluations` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `evaluator_id` int(11) NOT NULL,
  `evaluator_type` enum('mentor','supervisor') COLLATE utf8mb4_unicode_ci NOT NULL,
  `evaluation_type` enum('weekly','midterm','final') COLLATE utf8mb4_unicode_ci NOT NULL,
  `evaluation_date` date NOT NULL,
  `teaching_preparation` tinyint(4) DEFAULT NULL,
  `classroom_management` tinyint(4) DEFAULT NULL,
  `content_knowledge` tinyint(4) DEFAULT NULL,
  `teaching_methods` tinyint(4) DEFAULT NULL,
  `student_interaction` tinyint(4) DEFAULT NULL,
  `assessment_evaluation` tinyint(4) DEFAULT NULL,
  `professional_ethics` tinyint(4) DEFAULT NULL,
  `punctuality_attendance` tinyint(4) DEFAULT NULL,
  `communication_skills` tinyint(4) DEFAULT NULL,
  `adaptability` tinyint(4) DEFAULT NULL,
  `total_score` decimal(4,2) DEFAULT NULL,
  `grade` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `strengths` text COLLATE utf8mb4_unicode_ci,
  `weaknesses` text COLLATE utf8mb4_unicode_ci,
  `recommendations` text COLLATE utf8mb4_unicode_ci,
  `overall_feedback` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `evaluations`
--

INSERT INTO `evaluations` (`id`, `student_id`, `evaluator_id`, `evaluator_type`, `evaluation_type`, `evaluation_date`, `teaching_preparation`, `classroom_management`, `content_knowledge`, `teaching_methods`, `student_interaction`, `assessment_evaluation`, `professional_ethics`, `punctuality_attendance`, `communication_skills`, `adaptability`, `total_score`, `grade`, `strengths`, `weaknesses`, `recommendations`, `overall_feedback`, `created_at`) VALUES
(1, 1, 4, 'mentor', 'weekly', '2024-02-15', 4, 4, 3, 3, 4, 3, 5, 5, 4, 3, '38.00', 'B', 'มีความตรงต่อเวลา มีจริยธรรมดี', 'ควรพัฒนาเทคนิคการสอนให้หลากหลายมากขึ้น', 'แนะนำให้ศึกษาวิธีการสอนแบบ Active Learning', 'โดยรวมมีพัฒนาการที่ดี ควรเพิ่มความมั่นใจในการสอน', '2025-09-10 16:57:21');

-- --------------------------------------------------------

--
-- Table structure for table `lesson_plans`
--

CREATE TABLE `lesson_plans` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `grade_level` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_duration` int(11) NOT NULL,
  `learning_objectives` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `teaching_materials` text COLLATE utf8mb4_unicode_ci,
  `teaching_methods` text COLLATE utf8mb4_unicode_ci,
  `assessment_methods` text COLLATE utf8mb4_unicode_ci,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `status` enum('draft','submitted','approved','rejected','revision_required') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `mentor_feedback` text COLLATE utf8mb4_unicode_ci,
  `supervisor_feedback` text COLLATE utf8mb4_unicode_ci,
  `approved_by_mentor` int(11) DEFAULT NULL,
  `approved_by_supervisor` int(11) DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `login_history`
--

CREATE TABLE `login_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `login_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `login_status` enum('success','failed') COLLATE utf8mb4_unicode_ci DEFAULT 'success',
  `logout_time` timestamp NULL DEFAULT NULL,
  `session_duration` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `login_history`
--

INSERT INTO `login_history` (`id`, `user_id`, `login_time`, `ip_address`, `user_agent`, `login_status`, `logout_time`, `session_duration`) VALUES
(1, 5, '2025-09-10 18:44:21', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'success', NULL, NULL),
(2, 1, '2025-09-10 18:44:44', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'success', NULL, NULL),
(3, 1, '2025-09-10 18:45:42', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'success', NULL, NULL),
(4, 1, '2025-09-10 18:46:07', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'success', NULL, NULL),
(5, 1, '2025-09-10 18:48:39', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'success', NULL, NULL),
(6, 1, '2025-09-10 18:50:14', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'success', NULL, NULL),
(7, 5, '2025-09-10 18:50:48', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'success', NULL, NULL),
(8, 1, '2025-09-10 18:56:50', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'success', NULL, NULL),
(9, 1, '2025-09-10 18:56:57', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'success', NULL, NULL),
(10, 1, '2025-09-10 18:57:25', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'success', NULL, NULL),
(11, 1, '2025-09-10 18:59:53', '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.4768', 'success', NULL, NULL),
(12, 1, '2025-09-10 19:01:27', '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.4768', 'success', NULL, NULL),
(13, 1, '2025-09-10 19:01:54', '::1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.4768', 'success', NULL, NULL),
(14, 1, '2025-09-10 19:05:23', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'success', '2025-09-10 19:06:44', 81),
(15, 3, '2025-09-10 19:06:51', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'success', '2025-09-10 19:07:05', 14),
(16, 4, '2025-09-10 19:07:13', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'success', '2025-09-10 19:07:38', 25),
(17, 2, '2025-09-10 19:07:46', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'success', '2025-09-10 19:25:08', 1042),
(18, 1, '2025-09-10 19:25:12', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'success', '2025-09-10 19:58:39', 2007),
(19, 3, '2025-09-10 19:58:46', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'success', '2025-09-10 19:59:25', 39),
(20, 4, '2025-09-10 19:59:31', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'success', '2025-09-10 20:00:17', 46),
(21, 2, '2025-09-10 20:00:23', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'success', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mentor_teachers`
--

CREATE TABLE `mentor_teachers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `teacher_id` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `school_id` int(11) NOT NULL,
  `subject_specialty` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `teaching_experience` int(11) DEFAULT NULL,
  `education_level` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mentor_teachers`
--

INSERT INTO `mentor_teachers` (`id`, `user_id`, `teacher_id`, `school_id`, `subject_specialty`, `teaching_experience`, `education_level`, `position`, `is_active`, `created_at`) VALUES
(1, 4, 'T001', 1, 'ภาษาอังกฤษ', 10, 'ปริญญาตรี คุรุศาสตร์', 'ครูชำนาญการ', 1, '2025-09-10 16:57:21');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `subject` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message_content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `message_type` enum('general','urgent','feedback','question') COLLATE utf8mb4_unicode_ci DEFAULT 'general',
  `is_read` tinyint(1) DEFAULT '0',
  `read_at` timestamp NULL DEFAULT NULL,
  `reply_to_id` int(11) DEFAULT NULL,
  `attachment_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `notification_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `related_table` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `related_id` int(11) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `practicum_records`
--

CREATE TABLE `practicum_records` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `record_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `hours_worked` decimal(3,1) NOT NULL,
  `activities_description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `learning_outcomes` text COLLATE utf8mb4_unicode_ci,
  `challenges_faced` text COLLATE utf8mb4_unicode_ci,
  `reflections` text COLLATE utf8mb4_unicode_ci,
  `status` enum('draft','submitted','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `mentor_feedback` text COLLATE utf8mb4_unicode_ci,
  `mentor_approved_at` timestamp NULL DEFAULT NULL,
  `supervisor_feedback` text COLLATE utf8mb4_unicode_ci,
  `supervisor_approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `practicum_records`
--

INSERT INTO `practicum_records` (`id`, `student_id`, `record_date`, `start_time`, `end_time`, `hours_worked`, `activities_description`, `learning_outcomes`, `challenges_faced`, `reflections`, `status`, `mentor_feedback`, `mentor_approved_at`, `supervisor_feedback`, `supervisor_approved_at`, `created_at`) VALUES
(1, 1, '2024-02-15', '08:00:00', '12:00:00', '4.0', 'สังเกตการสอนของครูพี่เลี้ยง วิชาภาษาอังกฤษ ป.6 เรื่อง Present Simple Tense', 'เข้าใจวิธีการจัดกิจกรรมการเรียนรู้ที่เหมาะสมกับวัยของนักเรียน', 'นักเรียนบางคนยังไม่เข้าใจโครงสร้างประโยค', 'ควรมีการทบทวนบทเรียนก่อนหน้าเพื่อให้นักเรียนเข้าใจดีขึ้น', 'submitted', NULL, NULL, NULL, NULL, '2025-09-10 16:57:21'),
(2, 1, '2024-02-16', '08:00:00', '12:00:00', '4.0', 'ช่วยครูพี่เลี้ยงเตรียมสื่อการสอน และฝึกสอนนักเรียนกลุ่มเล็ก', 'ได้ฝึกปฏิสัมพันธ์กับนักเรียนและการใช้สื่อการสอน', 'การจัดระเบียบชั้นเรียนยังไม่คล่องแคล่ว', 'ต้องศึกษาเทคนิคการจัดการชั้นเรียนเพิ่มเติม', 'approved', NULL, NULL, NULL, NULL, '2025-09-10 16:57:21');

-- --------------------------------------------------------

--
-- Table structure for table `schools`
--

CREATE TABLE `schools` (
  `id` int(11) NOT NULL,
  `school_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `school_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `director_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `schools`
--

INSERT INTO `schools` (`id`, `school_name`, `school_type`, `address`, `district`, `province`, `postal_code`, `phone`, `email`, `director_name`, `is_active`, `created_at`) VALUES
(1, 'โรงเรียนบ้านโนนทอง', 'ประถมศึกษา', '123 หมู่ 5 ตำบลบ้านโนนทอง', 'เมืองมหาสารคาม', 'มหาสารคาม', '44000', '043-123456', 'nontong@school.ac.th', 'นายสมชาย แสงดี', 1, '2025-09-10 16:57:21'),
(2, 'โรงเรียนมหาสารคามพิทยาคาร', 'มัธยมศึกษา', '456 ถนนนครสวรรค์', 'เมืองมหาสารคาม', 'มหาสารคาม', '44000', '043-234567', 'mkp@school.ac.th', 'นางสาวพรทิพย์ เก่งเรียน', 1, '2025-09-10 16:57:21'),
(3, 'โรงเรียนวังใหม่วิทยาคาร', 'มัธยมศึกษา', '789 หมู่ 3 ตำบลวังใหม่', 'วางใหม่', 'มหาสารคาม', '44190', '043-345678', 'wangmai@school.ac.th', 'นายวิชัย ปัญญาดี', 1, '2025-09-10 16:57:21'),
(4, 'โรงเรียนบ้านสวนแป้น', 'ประถมศึกษา', '321 หมู่ 7 ตำบลสวนแป้น', 'กันทรวิชัย', 'มหาสารคาม', '44150', '043-456789', 'suanpaen@school.ac.th', 'นางรัตนา สุขใส', 1, '2025-09-10 16:57:21');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `student_id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `major` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'บรรณารักษ์ศึกษา-ภาษาอังกฤษ',
  `year_level` int(11) NOT NULL,
  `semester` int(11) NOT NULL,
  `academic_year` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gpa` decimal(3,2) DEFAULT NULL,
  `assigned_school_id` int(11) DEFAULT NULL,
  `assigned_mentor_id` int(11) DEFAULT NULL,
  `assigned_supervisor_id` int(11) DEFAULT NULL,
  `practicum_hours_completed` int(11) DEFAULT '0',
  `practicum_hours_required` int(11) DEFAULT '50',
  `status` enum('registered','assigned','in_progress','completed','failed') COLLATE utf8mb4_unicode_ci DEFAULT 'registered',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `user_id`, `student_id`, `major`, `year_level`, `semester`, `academic_year`, `gpa`, `assigned_school_id`, `assigned_mentor_id`, `assigned_supervisor_id`, `practicum_hours_completed`, `practicum_hours_required`, `status`, `created_at`) VALUES
(1, 3, '651234567890', 'บรรณารักษ์ศึกษา-ภาษาอังกฤษ', 4, 2, '2567', '3.25', NULL, NULL, NULL, 0, 50, 'registered', '2025-09-10 16:57:21'),
(2, 5, '653170010327', 'คณิตศาสตร์', 4, 2, '2567', '3.80', NULL, NULL, NULL, 0, 50, 'registered', '2025-09-10 18:41:58');

-- --------------------------------------------------------

--
-- Table structure for table `supervisors`
--

CREATE TABLE `supervisors` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `employee_id` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'คณะครุศาสตร์',
  `faculty` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'มหาวิทยาลัยราชภัฏมหาสารคาม',
  `subject_specialty` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `academic_rank` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `education_level` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `supervisors`
--

INSERT INTO `supervisors` (`id`, `user_id`, `employee_id`, `department`, `faculty`, `subject_specialty`, `academic_rank`, `education_level`, `is_active`, `created_at`) VALUES
(1, 2, 'EMP001', 'คณะครุศาสตร์', 'มหาวิทยาลัยราชภัฏมหาสารคาม', 'บรรณารักษ์ศึกษา-ภาษาอังกฤษ', 'อาจารย์', 'ปริญญาเอก การศึกษา', 1, '2025-09-10 16:57:21');

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_description` text COLLATE utf8mb4_unicode_ci,
  `setting_type` enum('string','number','boolean','json') COLLATE utf8mb4_unicode_ci DEFAULT 'string',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`id`, `setting_key`, `setting_value`, `setting_description`, `setting_type`, `created_at`) VALUES
(1, 'site_name', 'ระบบสารสนเทศนักศึกษาฝึกประสบการณ์วิชาชีพครู', 'ชื่อของเว็บไซต์', 'string', '2025-09-10 16:57:21'),
(2, 'required_practicum_hours', '50', 'จำนวนชั่วโมงฝึกประสบการณ์ที่จำเป็น', 'number', '2025-09-10 16:57:21'),
(3, 'max_file_size', '10485760', 'ขนาดไฟล์สูงสุดที่อัปโหลดได้ (bytes)', 'number', '2025-09-10 16:57:21'),
(4, 'allowed_file_types', '[\"pdf\",\"doc\",\"docx\",\"jpg\",\"jpeg\",\"png\"]', 'ประเภทไฟล์ที่อนุญาตให้อัปโหลด', 'json', '2025-09-10 16:57:21'),
(5, 'academic_year', '2567', 'ปีการศึกษาปัจจุบัน', 'string', '2025-09-10 16:57:21'),
(6, 'current_semester', '2', 'ภาคเรียนปัจจุบัน', 'number', '2025-09-10 16:57:21'),
(7, 'registration_open', 'true', 'เปิดการลงทะเบียนหรือไม่', 'boolean', '2025-09-10 16:57:21'),
(8, 'system_maintenance', 'false', 'ระบบอยู่ในช่วงปรับปรุงหรือไม่', 'boolean', '2025-09-10 16:57:21');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` int(11) NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role_id`, `first_name`, `last_name`, `phone`, `is_active`, `last_login`, `created_at`) VALUES
(1, 'admin', 'admin@rmu.ac.th', '$2b$10$FFa.SrlaWOAsjIGe1s3yzOtKG.6CnRoGIC1.Xwjb12GQ4k2WdyNUC', 1, 'ผู้ดูแล', 'ระบบ', '043-754321', 1, '2025-09-10 19:25:12', '2025-09-10 16:57:21'),
(2, 'supervisor1', 'supervisor1@rmu.ac.th', '$2b$10$FFa.SrlaWOAsjIGe1s3yzOtKG.6CnRoGIC1.Xwjb12GQ4k2WdyNUC', 4, 'อาจารย์สมชาย', 'ใจดี', '043-754322', 1, '2025-09-10 20:00:23', '2025-09-10 16:57:21'),
(3, 'student001', 'student001@rmu.ac.th', '$2b$10$FFa.SrlaWOAsjIGe1s3yzOtKG.6CnRoGIC1.Xwjb12GQ4k2WdyNUC', 2, 'สมหญิง', 'เรียนดี', '089-1234567', 1, '2025-09-10 19:58:46', '2025-09-10 16:57:21'),
(4, 'mentor001', 'mentor001@school.ac.th', '$2b$10$FFa.SrlaWOAsjIGe1s3yzOtKG.6CnRoGIC1.Xwjb12GQ4k2WdyNUC', 3, 'ครูสมศรี', 'สอนดี', '081-7654321', 1, '2025-09-10 19:59:31', '2025-09-10 16:57:21'),
(5, 'ak19556', 'ak19556@gmail.com', '$2b$10$a2MNnv1cfOjE5jIrSRvhlOnta/gXyWkfX80sUS7obDa0gfQ1tpSXm', 2, 'สมยศ', 'พันทอง', '123456', 1, '2025-09-10 18:50:48', '2025-09-10 18:41:58');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `role_name`, `role_description`, `created_at`) VALUES
(1, 'admin', 'ผู้ดูแลระบบ - สามารถจัดการข้อมูลทั้งหมดในระบบ', '2025-09-10 16:57:21'),
(2, 'student', 'นักศึกษา - ผู้เข้าร่วมการฝึกประสบการณ์วิชาชีพครู', '2025-09-10 16:57:21'),
(3, 'mentor', 'ครูพี่เลี้ยง - ครูในโรงเรียนที่ให้คำปรึกษาและดูแลนักศึกษา', '2025-09-10 16:57:21'),
(4, 'supervisor', 'อาจารย์นิเทศ/ครูแนะแนว - อาจารย์ที่รับผิดชอบดูแลนักศึกษา', '2025-09-10 16:57:21');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uploaded_by` (`uploaded_by`);

--
-- Indexes for table `evaluations`
--
ALTER TABLE `evaluations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evaluator_id` (`evaluator_id`),
  ADD KEY `idx_evaluations_student` (`student_id`);

--
-- Indexes for table `lesson_plans`
--
ALTER TABLE `lesson_plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `approved_by_mentor` (`approved_by_mentor`),
  ADD KEY `approved_by_supervisor` (`approved_by_supervisor`);

--
-- Indexes for table `login_history`
--
ALTER TABLE `login_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `mentor_teachers`
--
ALTER TABLE `mentor_teachers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `school_id` (`school_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reply_to_id` (`reply_to_id`),
  ADD KEY `idx_messages_receiver` (`receiver_id`),
  ADD KEY `idx_messages_sender` (`sender_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notifications_user` (`user_id`);

--
-- Indexes for table `practicum_records`
--
ALTER TABLE `practicum_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_practicum_records_student` (`student_id`),
  ADD KEY `idx_practicum_records_date` (`record_date`);

--
-- Indexes for table `schools`
--
ALTER TABLE `schools`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_students_student_id` (`student_id`),
  ADD KEY `idx_students_school` (`assigned_school_id`);

--
-- Indexes for table `supervisors`
--
ALTER TABLE `supervisors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_role` (`role_id`),
  ADD KEY `idx_users_email` (`email`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evaluations`
--
ALTER TABLE `evaluations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lesson_plans`
--
ALTER TABLE `lesson_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `login_history`
--
ALTER TABLE `login_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `mentor_teachers`
--
ALTER TABLE `mentor_teachers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `practicum_records`
--
ALTER TABLE `practicum_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `schools`
--
ALTER TABLE `schools`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `supervisors`
--
ALTER TABLE `supervisors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `evaluations`
--
ALTER TABLE `evaluations`
  ADD CONSTRAINT `evaluations_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `evaluations_ibfk_2` FOREIGN KEY (`evaluator_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `lesson_plans`
--
ALTER TABLE `lesson_plans`
  ADD CONSTRAINT `lesson_plans_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lesson_plans_ibfk_2` FOREIGN KEY (`approved_by_mentor`) REFERENCES `mentor_teachers` (`id`),
  ADD CONSTRAINT `lesson_plans_ibfk_3` FOREIGN KEY (`approved_by_supervisor`) REFERENCES `supervisors` (`id`);

--
-- Constraints for table `login_history`
--
ALTER TABLE `login_history`
  ADD CONSTRAINT `login_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `mentor_teachers`
--
ALTER TABLE `mentor_teachers`
  ADD CONSTRAINT `mentor_teachers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `mentor_teachers_ibfk_2` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`reply_to_id`) REFERENCES `messages` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `practicum_records`
--
ALTER TABLE `practicum_records`
  ADD CONSTRAINT `practicum_records_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `students_ibfk_2` FOREIGN KEY (`assigned_school_id`) REFERENCES `schools` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `supervisors`
--
ALTER TABLE `supervisors`
  ADD CONSTRAINT `supervisors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `user_roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
