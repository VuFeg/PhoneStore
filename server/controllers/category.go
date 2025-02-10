package controllers

import (
	"ecommerce-project/config"
	"ecommerce-project/models"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func CreateCategoryForProduct(c *gin.Context) {
	// Lấy product_id từ URL
	productIDParam := c.Param("id")
	fmt.Println(productIDParam)
	productID, err := uuid.Parse(productIDParam)
	if err != nil {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Invalid product id", err.Error())
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	// Kiểm tra xem sản phẩm có tồn tại hay không
	var product models.Product
	if err := config.DB.First(&product, "id = ?", productID).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusNotFound, "Product not found", err.Error())
		c.JSON(http.StatusNotFound, errResp)
		return
	}

	// Nhận dữ liệu cho phiên bản (category) mới từ request
	var input struct {
		Name        string  `json:"name" binding:"required"`  // Ví dụ: "256GB"
		Description string  `json:"description"`
		Price       float64 `json:"price" binding:"required"`
		Stock       int     `json:"stock" binding:"required"`
		// Không nhận public và active từ client khi tạo, mặc định là true.
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Invalid request payload", err.Error())
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	category := models.Category{
		ID:          uuid.New(),
		ProductID:   productID,
		Name:        input.Name,
		Description: input.Description,
		Price:       input.Price,
		Stock:       input.Stock,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := config.DB.Create(&category).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to create category", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	c.JSON(http.StatusCreated, category)
}

func UpdateCategory(c *gin.Context) {
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Invalid category id", err.Error())
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	var category models.Category
	if err := config.DB.First(&category, "id = ?", id).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusNotFound, "Category not found", err.Error())
		c.JSON(http.StatusNotFound, errResp)
		return
	}

	var input struct {
		Name        *string  `json:"name"`
		Description *string  `json:"description"`
		Price       *float64 `json:"price"`
		Stock       *int     `json:"stock"`
		Public      *bool    `json:"public"` // Cho phép update nếu cần
		Active      *bool    `json:"active"` // Cho phép update nếu cần
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Invalid request payload", err.Error())
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	if input.Name != nil {
		category.Name = *input.Name
	}
	if input.Description != nil {
		category.Description = *input.Description
	}
	if input.Price != nil {
		category.Price = *input.Price
	}
	if input.Stock != nil {
		category.Stock = *input.Stock
	}
	if input.Public != nil {
		category.Public = *input.Public
	}
	if input.Active != nil {
		category.Active = *input.Active
	}

	category.UpdatedAt = time.Now()

	if err := config.DB.Save(&category).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to update category", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	c.JSON(http.StatusOK, category)
}

func GetCategoriesForProduct(c *gin.Context) {
	productIDParam := c.Param("id")
	productID, err := uuid.Parse(productIDParam)
	if err != nil {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Invalid product id", err.Error())
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	var categories []models.Category
	if err := config.DB.Where("product_id = ?", productID).Find(&categories).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to retrieve categories", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	c.JSON(http.StatusOK, categories)
}


func GetCategoryByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Invalid category id", err.Error())
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	var category models.Category
	if err := config.DB.First(&category, "id = ?", id).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusNotFound, "Category not found", err.Error())
		c.JSON(http.StatusNotFound, errResp)
		return
	}

	c.JSON(http.StatusOK, category)
}