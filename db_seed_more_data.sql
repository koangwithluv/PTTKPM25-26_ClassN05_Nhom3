-- Seed thêm nhiều dữ liệu mẫu cho hệ thống tính lương giảng viên

-- Thêm nhiều giáo viên
INSERT INTO Teacher (code, fullName, dateOfBirth, phone, email, departmentId, degreeId) VALUES
('GV006', 'Nguyễn Thị F', '1981-06-01', '0906666666', 'f@example.com', 1, 2),
('GV007', 'Phạm Văn G', '1983-07-02', '0907777777', 'g@example.com', 2, 3),
('GV008', 'Lê Thị H', '1984-08-03', '0908888888', 'h@example.com', 3, 4),
('GV009', 'Trần Văn I', '1986-09-04', '0909999999', 'i@example.com', 1, 5),
('GV010', 'Đỗ Thị K', '1989-10-05', '0910000000', 'k@example.com', 2, 1);

-- Thêm nhiều học phần
INSERT INTO Course (code, name, credits, coefficient, periods) VALUES
('IT006', 'Phân tích thiết kế hệ thống', 3, 1.1, 45),
('IT007', 'Lập trình web', 4, 1.2, 60),
('IT008', 'Trí tuệ nhân tạo', 4, 1.3, 60),
('IT009', 'An toàn thông tin', 3, 1.0, 45),
('IT010', 'Điện toán đám mây', 3, 1.1, 45);

-- Thêm nhiều kỳ học
INSERT INTO Semester (name, academicYear, startDate, endDate) VALUES
('Học kỳ 1', '2025-2026', '2025-08-15', '2025-12-31'),
('Học kỳ 2', '2025-2026', '2026-01-15', '2026-05-31'),
('Học kỳ hè', '2025-2026', '2026-06-01', '2026-07-31');

-- Thêm nhiều lớp học phần
INSERT INTO Class (code, name, courseId, semesterId, students, periods) VALUES
('IT006.1', 'Phân tích thiết kế hệ thống - Nhóm 1', 6, 6, 40, 45),
('IT007.1', 'Lập trình web - Nhóm 1', 7, 6, 50, 60),
('IT008.1', 'Trí tuệ nhân tạo - Nhóm 1', 8, 7, 55, 60),
('IT009.1', 'An toàn thông tin - Nhóm 1', 9, 7, 35, 45),
('IT010.1', 'Điện toán đám mây - Nhóm 1', 10, 8, 60, 45);

-- Thêm nhiều assignment (phân công giảng viên)
INSERT INTO Assignment (lecturerId, classId) VALUES
(6, 11), (7, 12), (8, 13), (9, 14), (10, 15),
(1, 11), (2, 12), (3, 13), (4, 14), (5, 15);

-- Thêm hệ số lớp mới
INSERT INTO ClassCoeff (minStudents, maxStudents, coeff, description) VALUES
(80, 99, 1.5, 'Lớp rất đông'),
(100, 200, 1.7, 'Lớp siêu đông');

-- Thêm hệ số giáo viên mới
INSERT INTO DegreeCoeff (degreeId, coeff, description) VALUES
(1, 1.1, 'Cử nhân nâng cao'),
(2, 1.6, 'Thạc sỹ nâng cao'),
(3, 1.8, 'Tiến sỹ nâng cao');

-- Thêm định mức tiền/tiết mới
INSERT INTO Rate (name, value, description, appliedFrom) VALUES
('Định mức nâng cao', 160000, 'Định mức cho năm 2025-2026', '2025-08-01');
