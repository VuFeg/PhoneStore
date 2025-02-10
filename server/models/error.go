package models

// ErrorResponse định nghĩa cấu trúc lỗi trả về cho client
type ErrorResponse struct {
    StatusCode int      `json:"status_code"`          // Mã HTTP status
    Message    string   `json:"message"`              // Thông báo lỗi chung
    Details    []string `json:"details,omitempty"`    // Danh sách chi tiết lỗi (nếu có)
}

// NewErrorResponse là hàm khởi tạo nhanh cho ErrorResponse
func NewErrorResponse(statusCode int, message string, details ...string) *ErrorResponse {
    return &ErrorResponse{
        StatusCode: statusCode,
        Message:    message,
        Details:    details,
    }
}
