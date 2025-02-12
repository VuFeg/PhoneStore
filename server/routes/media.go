package routes

import (
	"ecommerce-project/controllers"
	"ecommerce-project/middleware"

	"github.com/gin-gonic/gin"
)

// RegisterMediaRoutes đăng ký các route liên quan đến media (hình ảnh)
func MediaRoutes(router *gin.RouterGroup) {
	// Định nghĩa route cho upload image, sử dụng phương thức POST
	router.Use(middleware.AuthMiddleware("admin"))
	{
		router.POST("/media/upload", controllers.UploadImage)
		router.DELETE("/media/images", controllers.DeleteImage)
	}
}
