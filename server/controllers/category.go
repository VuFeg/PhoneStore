package controllers

import (
	"net/http"
	"time"

	"ecommerce-project/config"
	"ecommerce-project/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CreateCategory creates a new category
func CreateCategory(c *gin.Context) {
    var input models.Category
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    input.ID = uuid.New()
    input.CreatedAt = time.Now()
    input.UpdatedAt = time.Now()

    if err := config.DB.Create(&input).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, input)
}

// GetCategories retrieves all categories
func GetCategories(c *gin.Context) {
    var categories []models.Category
    if err := config.DB.Find(&categories).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, categories)
}

// GetCategory retrieves a category by ID
func GetCategory(c *gin.Context) {
    id := c.Param("id")
    var category models.Category
    if err := config.DB.First(&category, "id = ?", id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
        return
    }

    c.JSON(http.StatusOK, category)
}

// UpdateCategory updates a category by ID
func UpdateCategory(c *gin.Context) {
    id := c.Param("id")
    var category models.Category
    if err := config.DB.First(&category, "id = ?", id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
        return
    }

    var input models.Category
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    category.Name = input.Name
    category.UpdatedAt = time.Now()

    if err := config.DB.Save(&category).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, category)
}

// DeleteCategory deletes a category by ID
func DeleteCategory(c *gin.Context) {
    id := c.Param("id")
    if err := config.DB.Delete(&models.Category{}, "id = ?", id).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Category deleted successfully"})
}