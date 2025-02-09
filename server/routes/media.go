package routes

import (
	"ecommerce-project/controllers"

	"github.com/gin-gonic/gin"
)

// RegisterMediaRoutes đăng ký các route liên quan đến media (hình ảnh)
func MediaRoutes(router *gin.RouterGroup) {
	// Định nghĩa route cho upload image, sử dụng phương thức POST
	router.POST("/upload", controllers.UploadImage)
}
