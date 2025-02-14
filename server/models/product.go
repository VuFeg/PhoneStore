package models

import (
	"time"

	"github.com/google/uuid"
)

// Product lưu thông tin chung của sản phẩm
type Product struct {
    ID          uuid.UUID         `gorm:"type:uuid;primary_key" json:"id"`
    Name        string            `gorm:"size:200;not null" json:"name"`
    Description string            `json:"description"`
    // ImageURLs lưu danh sách URL hình ảnh (được lưu dưới dạng JSON trong database)
    ImageURLs   []string         `gorm:"type:json;serializer:json" json:"image_urls"`
    Public      bool              `gorm:"default:true" json:"public"`
    Variants    []ProductVariant  `gorm:"foreignKey:ProductID;references:ID" json:"variants"`
    CategoryID  uuid.UUID         `gorm:"type:uuid;not null" json:"category_id"`
    Category    Category          `gorm:"foreignKey:CategoryID;references:ID" json:"category"`
    CreatedAt   time.Time         `json:"created_at"`
    UpdatedAt   time.Time         `json:"updated_at"`
}

// CreateProductInput chỉ chứa các trường thông tin chung của sản phẩm
type CreateProductInput struct {
    Name        string   `json:"name" binding:"required"`
    Description string   `json:"description"`
    // Bắt buộc phải có mảng URL, mỗi URL hợp lệ
    ImageURLs   []string `json:"image_urls" binding:"required,dive,url"`
    CategoryID  string   `json:"category_id" binding:"required,uuid"`
}

// UpdateProductInput chỉ cho phép cập nhật thông tin chung của sản phẩm
type UpdateProductInput struct {
    Name        *string   `json:"name"`
    Description *string   `json:"description"`
    ImageURLs   *[]string `json:"image_urls"`
    Public      *bool     `json:"public"`
    CategoryID  *string   `json:"category_id" binding:"omitempty,uuid"`
}