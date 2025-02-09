package controllers

import (
	"ecommerce-project/config"
	"ecommerce-project/models"
	"ecommerce-project/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// Register
func Register(c *gin.Context) {
    type Request struct {
        Username string `json:"username" validate:"required,min=3,max=50"`
        Email    string `json:"email" validate:"required,email"`
        Password string `json:"password" validate:"required,min=6"`
    }

    var req Request
    if err := c.ShouldBindJSON(&req); err != nil {
        utils.HandleValidationError(c, err)
        return
    }

    // Validate request
    if err := utils.Validate.Struct(req); err != nil {
        utils.HandleValidationError(c, err)
        return
    }

    // Kiểm tra email đã tồn tại trong database
    var existingUser models.User
    if err := config.DB.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
        c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
        return
    }

    // Hash password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Password hashing failed"})
        return
    }

    // Lưu user vào database
    localUser := models.User{
        ID:           uuid.New(),
        Username:     req.Username,
        Email:        req.Email,
        PasswordHash: string(hashedPassword),
    }

    if err := config.DB.Create(&localUser).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save user in database"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

// Login
func Login(c *gin.Context) {
    type Request struct {
        Email    string `json:"email" validate:"required,email"`
        Password string `json:"password" validate:"required"`
    }

    var req Request
    if err := c.ShouldBindJSON(&req); err != nil {
        utils.HandleValidationError(c, err)
        return
    }

    // Validate request
    if err := utils.Validate.Struct(req); err != nil {
        utils.HandleValidationError(c, err)
        return
    }

    // Lấy thông tin user từ database
    var user models.User
    if err := config.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
        return
    }

    // So sánh password
    if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
        return
    }

    // Tạo access token và refresh token
    accessToken, refreshToken, err := utils.GenerateTokens(user)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate tokens"})
        return
    }

    // Lưu refresh token vào database
    newRefreshToken := models.RefreshToken{
        ID:        uuid.New(),
        UserID:    user.ID,
        Token:     refreshToken,
        ExpiresAt: time.Now().Add(7 * 24 * time.Hour), // Refresh token hết hạn sau 7 ngày
        CreatedAt: time.Now(),
    }

    if err := config.DB.Create(&newRefreshToken).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save refresh token"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "access_token":  accessToken,
        "refresh_token": refreshToken,
    })
}

// Logout
func Logout(c *gin.Context) {
	type Request struct {
		AccessToken  string `json:"access_token" validate:"required"`
		RefreshToken string `json:"refresh_token" validate:"required"`
	}

	var req Request
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.HandleValidationError(c, err)
		return
	}

	// Xóa refresh token khỏi database
	if err := config.DB.Where("token = ?", req.RefreshToken).Delete(&models.RefreshToken{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete refresh token"})
		return
	}

	// Logout from Supabase
	err := config.Supabase.Auth.SignOut(c.Request.Context(), req.AccessToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to logout from Supabase"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

// Refresh Token
func Refresh(c *gin.Context) {
	type Request struct {
		RefreshToken string `json:"refresh_token" validate:"required"`
	}

	var req Request
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.HandleValidationError(c, err)
		return
	}

	// Validate request
	if err := utils.Validate.Struct(req); err != nil {
		utils.HandleValidationError(c, err)
		return
	}

	// Refresh session with Supabase
	session, err := config.Supabase.Auth.RefreshUser(c.Request.Context(), req.RefreshToken, "")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token":  session.AccessToken,
		"refresh_token": session.RefreshToken,
	})
}