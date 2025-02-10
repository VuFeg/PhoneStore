package controllers

import (
	"net/http"
	"time"

	"ecommerce-project/config"
	"ecommerce-project/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// getOrCreateCart lấy Cart của người dùng dựa trên userID.
// Nếu Cart chưa tồn tại, hàm sẽ tạo mới.
func getOrCreateCart(userID uuid.UUID) (models.Cart, error) {
	var cart models.Cart
	err := config.DB.Where("user_id = ?", userID).First(&cart).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			// Tạo mới Cart
			cart = models.Cart{
				ID:        uuid.New(),
				UserID:    userID,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			}
			err = config.DB.Create(&cart).Error
		}
	}
	return cart, err
}

// AddCartItem thêm một mặt hàng vào Cart của người dùng.
func AddCartItem(c *gin.Context) {
	// Lấy userID từ context (middleware xác thực đã lưu userID)
	userIDInterface, exists := c.Get("userID")
	if !exists {
		errResp := models.NewErrorResponse(http.StatusUnauthorized, "Unauthorized", "Unauthorized")
		c.JSON(http.StatusUnauthorized, errResp)
		return
	}
	userID, ok := userIDInterface.(uuid.UUID)
	if !ok {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Invalid user id", "Invalid user id")
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	// Nhận dữ liệu từ request (sử dụng input được định nghĩa trong models, ví dụ: AddCartItemInput)
	var input models.AddCartItemInput
	if err := c.ShouldBindJSON(&input); err != nil {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Invalid request payload", err.Error())
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	variantID, err := uuid.Parse(input.VariantID)
	if err != nil {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Invalid variant id", err.Error())
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	// Lấy (hoặc tạo mới) Cart của người dùng
	cart, err := getOrCreateCart(userID)
	if err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to get or create cart", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	// Kiểm tra nếu mặt hàng đã có trong Cart (dựa trên CartID và VariantID)
	var cartItem models.CartItem
	err = config.DB.Where("cart_id = ? AND variant_id = ?", cart.ID, variantID).
		First(&cartItem).Error
	if err == nil {
		// Nếu đã có, cập nhật số lượng
		cartItem.Quantity += input.Quantity
		cartItem.UpdatedAt = time.Now()
		if err := config.DB.Save(&cartItem).Error; err != nil {
			errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to update cart item", err.Error())
			c.JSON(http.StatusInternalServerError, errResp)
			return
		}
		c.JSON(http.StatusOK, cartItem)
		return
	}

	// Nếu chưa có, tạo mới CartItem
	newCartItem := models.CartItem{
		ID:        uuid.New(),
		CartID:    cart.ID,
		VariantID: variantID,
		Quantity:  input.Quantity,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	if err := config.DB.Create(&newCartItem).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to add item to cart", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}
	c.JSON(http.StatusCreated, newCartItem)
}

// GetCartItems lấy Cart của người dùng kèm danh sách CartItem (preload Variant).
func GetCartItems(c *gin.Context) {
	userIDInterface, exists := c.Get("userID")
	if !exists {
		errResp := models.NewErrorResponse(http.StatusUnauthorized, "Unauthorized", "Unauthorized")
		c.JSON(http.StatusUnauthorized, errResp)
		return
	}
	userID, ok := userIDInterface.(uuid.UUID)
	if !ok {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Invalid user id", "Invalid user id")
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	// Lấy Cart của người dùng (hoặc tạo mới nếu chưa tồn tại)
	cart, err := getOrCreateCart(userID)
	if err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to get cart", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	// Preload CartItems và Variant
	if err := config.DB.Preload("CartItems.Variant").First(&cart, "id = ?", cart.ID).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to fetch cart items", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}
	c.JSON(http.StatusOK, cart)
}

// UpdateCartItem cập nhật số lượng của một CartItem trong Cart.
func UpdateCartItem(c *gin.Context) {
	// Lấy userID từ context
	userIDInterface, exists := c.Get("userID")
	if !exists {
		errResp := models.NewErrorResponse(http.StatusUnauthorized, "Unauthorized", "Unauthorized")
		c.JSON(http.StatusUnauthorized, errResp)
		return
	}
	userID, ok := userIDInterface.(uuid.UUID)
	if !ok {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Invalid user id", "Invalid user id")
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	// Lấy CartItem id từ URL
	cartItemIDParam := c.Param("id")
	cartItemID, err := uuid.Parse(cartItemIDParam)
	if err != nil {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Invalid cart item id", err.Error())
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	var input models.UpdateCartItemInput
	if err := c.ShouldBindJSON(&input); err != nil {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Invalid request payload", err.Error())
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	var cartItem models.CartItem
	// Sử dụng JOIN để đảm bảo CartItem thuộc về Cart của người dùng.
	if err := config.DB.Joins("JOIN carts ON carts.id = cart_items.cart_id").
		Where("cart_items.id = ? AND carts.user_id = ?", cartItemID, userID).
		First(&cartItem).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusNotFound, "Cart item not found", err.Error())
		c.JSON(http.StatusNotFound, errResp)
		return
	}

	cartItem.Quantity = *input.Quantity
	cartItem.UpdatedAt = time.Now()
	if err := config.DB.Save(&cartItem).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to update cart item", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}
	c.JSON(http.StatusOK, cartItem)
}

// DeleteCartItem xoá một CartItem khỏi Cart.
func DeleteCartItem(c *gin.Context) {
	userIDInterface, exists := c.Get("userID")
	if !exists {
		errResp := models.NewErrorResponse(http.StatusUnauthorized, "Unauthorized", "Unauthorized")
		c.JSON(http.StatusUnauthorized, errResp)
		return
	}
	userID, ok := userIDInterface.(uuid.UUID)
	if !ok {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Invalid user id", "Invalid user id")
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	cartItemIDParam := c.Param("id")
	cartItemID, err := uuid.Parse(cartItemIDParam)
	if err != nil {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Invalid cart item id", err.Error())
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	// Xoá CartItem bằng cách join với Cart để đảm bảo thuộc về người dùng.
	if err := config.DB.
		Joins("JOIN carts ON carts.id = cart_items.cart_id").
		Where("cart_items.id = ? AND carts.user_id = ?", cartItemID, userID).
		Delete(&models.CartItem{}).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to delete cart item", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Cart item deleted successfully"})
}

// ClearCart xoá toàn bộ CartItem trong Cart của người dùng.
func ClearCart(c *gin.Context) {
	userIDInterface, exists := c.Get("userID")
	if !exists {
		errResp := models.NewErrorResponse(http.StatusUnauthorized, "Unauthorized", "Unauthorized")
		c.JSON(http.StatusUnauthorized, errResp)
		return
	}
	userID, ok := userIDInterface.(uuid.UUID)
	if !ok {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Invalid user id", "Invalid user id")
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	// Lấy Cart của người dùng
	cart, err := getOrCreateCart(userID)
	if err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to get cart", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	if err := config.DB.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to clear cart", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Cart cleared successfully"})
}

// CheckoutCart xử lý thanh toán cho toàn bộ Cart của người dùng.
// Sau khi thanh toán thành công, toàn bộ CartItem trong Cart sẽ bị xoá.
func CheckoutCart(c *gin.Context) {
	userIDInterface, exists := c.Get("userID")
	if !exists {
		errResp := models.NewErrorResponse(http.StatusUnauthorized, "Unauthorized", "Unauthorized")
		c.JSON(http.StatusUnauthorized, errResp)
		return
	}
	userID, ok := userIDInterface.(uuid.UUID)
	if !ok {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Invalid user id", "Invalid user id")
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	// Lấy Cart của người dùng
	cart, err := getOrCreateCart(userID)
	if err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to get cart", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	// Lấy tất cả CartItem trong Cart
	var cartItems []models.CartItem
	if err := config.DB.Where("cart_id = ?", cart.ID).Find(&cartItems).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to fetch cart items", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	if len(cartItems) == 0 {
		errResp := models.NewErrorResponse(http.StatusBadRequest, "Cart is empty", "Cart is empty")
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	// Giả sử xử lý thanh toán thành công (tích hợp gateway thanh toán nếu cần)
	// Sau đó, xoá toàn bộ CartItem trong Cart.
	if err := config.DB.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
		errResp := models.NewErrorResponse(http.StatusInternalServerError, "Failed to remove purchased items from cart", err.Error())
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":         "Checkout successful",
		"purchased_items": cartItems,
		"checkout_time":   time.Now(),
	})
}
