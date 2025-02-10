package models

import (
	"time"

	"github.com/google/uuid"
)

// ProductVariant đại diện cho một phiên bản của sản phẩm
type ProductVariant struct {
	ID         uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
	ProductID  uuid.UUID `gorm:"type:uuid;not null" json:"product_id"` // Liên kết với Product
	Color      string    `gorm:"size:50;not null" json:"color"`         // Ví dụ: "Đen", "Trắng", "Xanh"
	Capacity   string    `gorm:"size:50;not null" json:"capacity"`      // Ví dụ: "256GB", "512GB", "1TB"
	Price      float64   `gorm:"type:numeric(10,2)" json:"price"`
	Stock      int       `json:"stock"`
	// Active: cho biết phiên bản này có được kích hoạt để mua hay không
	Active     bool      `gorm:"default:true" json:"active"`
	// Default: chỉ có 1 variant được đánh dấu là mặc định cho mỗi product
	Default    bool      `gorm:"default:false" json:"default"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type CreateVariantInput struct {
	Color    string  `json:"color" binding:"required"`
	Capacity string  `json:"capacity" binding:"required"`
	Price    float64 `json:"price" binding:"required"`
	Stock    int     `json:"stock" binding:"required"`
	Default  bool    `json:"default"` // Nếu true, variant này sẽ là mặc định của sản phẩm
	Active   bool    `json:"active"`  // Cho biết variant có được kích hoạt để mua hay không
}

type UpdateVariantInput struct {
	Color    *string  `json:"color"`
	Capacity *string  `json:"capacity"`
	Price    *float64 `json:"price"`
	Stock    *int     `json:"stock"`
	Default  *bool    `json:"default"`
	Active   *bool    `json:"active"`
}