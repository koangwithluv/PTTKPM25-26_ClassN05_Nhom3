-- Seed dữ liệu hệ số lớp chuẩn theo số sinh viên
DELETE FROM ClassCoeff;
INSERT INTO ClassCoeff (minStudents, maxStudents, coeff, description) VALUES
  (0, 19, -0.3, 'Dưới 20 sinh viên'),
  (20, 29, -0.2, 'Từ 20 đến 29 sinh viên'),
  (30, 39, -0.1, 'Từ 30 đến 39 sinh viên'),
  (40, 49, 0, 'Từ 40 đến 49 sinh viên'),
  (50, 59, 0.1, 'Từ 50 đến 59 sinh viên'),
  (60, 69, 0.2, 'Từ 60 đến 69 sinh viên'),
  (70, 79, 0.3, 'Từ 70 đến 79 sinh viên');
