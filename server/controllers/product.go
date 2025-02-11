package controllers

import (
	"math"
	"net/http"
	"strconv"
	"time"

	"ecommerce-project/config"
	"ecommerce-project/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetProducts(c *gin.Context) {
	// Lấy tham số page và page_size từ query string
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil || page < 1 {
		page = 1
	}
	pageSize, err := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	if err != nil || pageSize < 1 {
		pageSize = 10
	}
	offset := (page - 1) * pageSize

	// Lấy tổng số bản ghi sản phẩm
	var total int64
	if err := config.DB.Model(&models.Product{}).Count(&total).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to count products", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	// Lấy danh sách sản phẩm theo phân trang, preload luôn các Variants
	var products []models.Product
	if err := config.DB.Preload("Variants").Offset(offset).Limit(pageSize).Find(&products).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to fetch products", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	totalPages := int(math.Ceil(float64(total) / float64(pageSize)))

	c.JSON(http.StatusOK, gin.H{
		"data": products,
		"pagination": gin.H{
			"total":       total,
			"page":        page,
			"page_size":   pageSize,
			"total_pages": totalPages,
		},
	})
}

func GetProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	// Preload các Variants của sản phẩm
	if err := config.DB.Preload("Variants").First(&product, "id = ?", id).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusNotFound, "Product not found", err.Error())
		c.JSON(http.StatusNotFound, errResp)
		return
	}

	c.JSON(http.StatusOK, product)
}

func CreateProduct(c *gin.Context) {
	var input models.CreateProductInput

	// Bind dữ liệu JSON từ request vào input
	if err := c.ShouldBindJSON(&input); err != nil {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Invalid request payload", err.Error())
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	// Tạo đối tượng product với mảng ảnh
	product := models.Product{
		ID:          uuid.New(),
		Name:        input.Name,
		Description: input.Description,
		ImageURLs:   input.ImageURLs,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// Lưu product vào database
	if err := config.DB.Create(&product).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to create product", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	// Trả về product đã tạo
	c.JSON(http.StatusCreated, product)
}

func UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	if err := config.DB.First(&product, "id = ?", id).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusNotFound, "Product not found", err.Error())
		c.JSON(http.StatusNotFound, errResp)
		return
	}

	var input models.UpdateProductInput
	if err := c.ShouldBindJSON(&input); err != nil {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Invalid request payload", err.Error())
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	if input.Name != nil {
		product.Name = *input.Name
	}
	if input.Description != nil {
		product.Description = *input.Description
	}
	// Cập nhật mảng ảnh nếu có
	if input.ImageURLs != nil {
		product.ImageURLs = *input.ImageURLs
	}
	if input.Public != nil {
		product.Public = *input.Public
	}

	product.UpdatedAt = time.Now()

	if err := config.DB.Save(&product).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to update product", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	c.JSON(http.StatusOK, product)
}

func DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.Product{}, "id = ?", id).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to delete product", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}
