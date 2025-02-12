package models

import (
	"time"

	"github.com/google/uuid"
)

// ProductVariant đại diện cho một phiên bản của sản phẩm
type ProductVariant struct {
	ID         uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
	ProductID  uuid.UUID `gorm:"type:uuid;not null" json:"product_id"`
	Color      string    `gorm:"size:50;not null" json:"color"`
	Capacity   string    `gorm:"size:50;not null" json:"capacity"`
	Price      float64   `gorm:"type:numeric(10,2)" json:"price"`
	Stock      int       `json:"stock"`
	Active     bool      `gorm:"default:true" json:"active"`
	Default    bool      `gorm:"default:false" json:"default"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// CreateVariantInput chỉ chứa các trường thông tin cần thiết để tạo variant
type CreateVariantInput struct {
	Color    string  `json:"color" binding:"required"`
	Capacity string  `json:"capacity" binding:"required"`
	Price    float64 `json:"price" binding:"required"`
	Stock    int     `json:"stock" binding:"required"`
	// Nếu true, variant này sẽ là mặc định của sản phẩm
	Default  bool    `json:"default"`
	// Cho biết variant có được kích hoạt để mua hay không
	Active   bool    `json:"active"`
}

// UpdateVariantInput chỉ cho phép cập nhật thông tin variant
type UpdateVariantInput struct {
	Color    *string  `json:"color"`
	Capacity *string  `json:"capacity"`
	Price    *float64 `json:"price"`
	Stock    *int     `json:"stock"`
	Default  *bool    `json:"default"`
	Active   *bool    `json:"active"`
}
