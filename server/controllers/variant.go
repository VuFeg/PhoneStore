package controllers

import (
	"ecommerce-project/config"
	"ecommerce-project/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CreateVariantForProduct tạo một variant (phiên bản) cho sản phẩm
func CreateVariantForProduct(c *gin.Context) {
	// Lấy product id từ URL (sử dụng tham số :id)
	productIDParam := c.Param("id")
	productID, err := uuid.Parse(productIDParam)
	if err != nil {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Invalid product id", err.Error())
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	// Kiểm tra xem sản phẩm có tồn tại không
	var product models.Product
	if err := config.DB.First(&product, "id = ?", productID).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusNotFound, "Product not found", err.Error())
		c.JSON(http.StatusNotFound, errResp)
		return
	}

	// Nhận dữ liệu từ request: bao gồm các thuộc tính variant như color, capacity, price, stock, default và active
	var input models.CreateVariantInput

	if err := c.ShouldBindJSON(&input); err != nil {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Invalid request payload", err.Error())
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	// Nếu input.Default là true, cập nhật tất cả variant khác của sản phẩm đó về default=false
	if input.Default {
		if err := config.DB.Model(&models.ProductVariant{}).
			Where("product_id = ?", productID).
			Update("default", false).Error; err != nil {
			errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to update default variants", err.Error())
			c.JSON(http.StatusInternalServerError, errResp)
			return
		}
	}

	// Tạo variant mới
	variant := models.ProductVariant{
		ID:         uuid.New(),
		ProductID:  productID,
		Color:      input.Color,
		Capacity:   input.Capacity,
		Price:      input.Price,
		Stock:      input.Stock,
		Default:    input.Default,
		Active:     input.Active,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}

	if err := config.DB.Create(&variant).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to create variant", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	c.JSON(http.StatusCreated, variant)
}

// UpdateVariant cập nhật thông tin của một variant
func UpdateVariant(c *gin.Context) {
	// Lấy variant id từ URL (tham số :id)
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Invalid variant id", err.Error())
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	// Tìm variant trong database
	var variant models.ProductVariant
	if err := config.DB.First(&variant, "id = ?", id).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusNotFound, "Variant not found", err.Error())
		c.JSON(http.StatusNotFound, errResp)
		return
	}

	// Nhận dữ liệu cập nhật từ request
	var input models.UpdateVariantInput

	if err := c.ShouldBindJSON(&input); err != nil {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Invalid request payload", err.Error())
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	// Nếu cập nhật default = true, cập nhật tất cả variant khác của cùng sản phẩm về default=false
	if input.Default != nil && *input.Default {
		if err := config.DB.Model(&models.ProductVariant{}).
			Where("product_id = ? AND id <> ?", variant.ProductID, variant.ID).
			Update("default", false).Error; err != nil {
			errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to update default variants", err.Error())
			c.JSON(http.StatusInternalServerError, errResp)
			return
		}
	}

	if input.Color != nil {
		variant.Color = *input.Color
	}
	if input.Capacity != nil {
		variant.Capacity = *input.Capacity
	}
	if input.Price != nil {
		variant.Price = *input.Price
	}
	if input.Stock != nil {
		variant.Stock = *input.Stock
	}
	if input.Default != nil {
		variant.Default = *input.Default
	}
	if input.Active != nil {
		variant.Active = *input.Active
	}

	variant.UpdatedAt = time.Now()

	if err := config.DB.Save(&variant).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to update variant", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	c.JSON(http.StatusOK, variant)
}

// GetVariantsForProduct lấy danh sách tất cả variant của một sản phẩm
func GetVariantsForProduct(c *gin.Context) {
	// Lấy product id từ URL (tham số :id)
	productIDParam := c.Param("id")
	productID, err := uuid.Parse(productIDParam)
	if err != nil {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Invalid product id", err.Error())
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	var variants []models.ProductVariant
	if err := config.DB.Where("product_id = ?", productID).Find(&variants).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to retrieve variants", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	c.JSON(http.StatusOK, variants)
}

// GetVariantByID lấy chi tiết của một variant dựa trên variant id
func GetVariantByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Invalid variant id", err.Error())
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	var variant models.ProductVariant
	if err := config.DB.First(&variant, "id = ?", id).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusNotFound, "Variant not found", err.Error())
		c.JSON(http.StatusNotFound, errResp)
		return
	}

	c.JSON(http.StatusOK, variant)
}

// DeleteVariant xoá một variant theo id
func DeleteVariant(c *gin.Context) {
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Invalid variant id", err.Error())
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	if err := config.DB.Delete(&models.ProductVariant{}, "id = ?", id).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to delete variant", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Variant deleted successfully"})
}
