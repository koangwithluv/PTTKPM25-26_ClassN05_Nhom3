-- Thêm cột batchId để phân biệt các lần tính tiền dạy
ALTER TABLE TeachingHistory
  ADD COLUMN batchId CHAR(36) NULL AFTER id;

-- Gán batchId tạm thời cho các bản ghi hiện hữu
UPDATE TeachingHistory
  SET batchId = UUID()
  WHERE batchId IS NULL;

-- Đảm bảo tất cả bản ghi đều có batchId
ALTER TABLE TeachingHistory
  MODIFY COLUMN batchId CHAR(36) NOT NULL;
