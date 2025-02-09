package controllers

import (
	"ecommerce-project/config"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func UploadImage(c *gin.Context) {
	file, err := c.FormFile("file")
    if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error message": "No image uploaded"})
		return
    }

	stor, err := config.GetStorage()
    if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error message": "Failed to get storage client"})
		return
    }

	url, err := stor.UploadFile(file)
	fmt.Println("url:",url)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error message": "Failed to upload image"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"url": url})
}
