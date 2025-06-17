-- Seed dữ liệu mẫu cho Course, Semester, Class, Assignment, Teacher

-- Course (Học phần)
DELETE FROM Course;
INSERT INTO Course (code, name, credits, coefficient, periods) VALUES
  ('IT001', 'Nhập môn lập trình', 3, 1.0, 45),
  ('IT002', 'Lập trình hướng đối tượng', 4, 1.2, 60),
  ('IT003', 'Cấu trúc dữ liệu và giải thuật', 4, 1.3, 60),
  ('IT004', 'Cơ sở dữ liệu', 4, 1.1, 60),
  ('IT005', 'Mạng máy tính', 3, 1.0, 45);

-- Semester (Kì học)
DELETE FROM Semester;
INSERT INTO Semester (name, academicYear, startDate, endDate) VALUES
  ('Học kỳ 1', '2023-2024', '2023-08-15', '2023-12-31'),
  ('Học kỳ 2', '2023-2024', '2024-01-15', '2024-05-31'),
  ('Học kỳ hè', '2023-2024', '2024-06-01', '2024-07-31');

-- Class (Lớp học phần)
DELETE FROM Class;
INSERT INTO Class (code, name, courseId, semesterId, students) VALUES
  ('IT001.1', 'Nhập môn lập trình - Nhóm 1', 1, 1, 40),
  ('IT001.2', 'Nhập môn lập trình - Nhóm 2', 1, 1, 35),
  ('IT002.1', 'Lập trình hướng đối tượng - Nhóm 1', 2, 1, 45),
  ('IT003.1', 'Cấu trúc dữ liệu và giải thuật - Nhóm 1', 3, 2, 50),
  ('IT004.1', 'Cơ sở dữ liệu - Nhóm 1', 4, 2, 55);

-- Assignment (Phân công giảng viên)
DELETE FROM Assignment;
INSERT INTO Assignment (lecturerId, classId) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5);

-- Teacher (Giáo viên)
DELETE FROM Teacher;
INSERT INTO Teacher (id, code, fullName, dateOfBirth, phone, email, departmentId, degreeId) VALUES
  (1, 'GV001', 'Nguyễn Văn A', '1980-01-01', '0901111111', 'a@example.com', 1, 1),
  (2, 'GV002', 'Trần Thị B', '1982-02-02', '0902222222', 'b@example.com', 1, 2),
  (3, 'GV003', 'Lê Văn C', '1985-03-03', '0903333333', 'c@example.com', 2, 3),
  (4, 'GV004', 'Phạm Thị D', '1987-04-04', '0904444444', 'd@example.com', 2, 4),
  (5, 'GV005', 'Hoàng Văn E', '1990-05-05', '0905555555', 'e@example.com', 3, 5);

-- Thay đổi cấu trúc bảng TeachingHistory
ALTER TABLE TeachingHistory
  ADD COLUMN academicYear VARCHAR(20) NULL AFTER subjectName,
  ADD COLUMN semesterName VARCHAR(50) NULL AFTER academicYear;
