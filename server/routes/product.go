package routes

import (
	"ecommerce-project/controllers"
	"ecommerce-project/middleware"

	"github.com/gin-gonic/gin"
)

func ProductRoutes(r *gin.RouterGroup) {
	// Routes dành cho mọi người (không cần quyền admin)
	r.GET("/products", controllers.GetProducts)
	r.GET("/products/:id", controllers.GetProduct)

	// Các route yêu cầu admin
	adminGroup := r.Group("/admin")
	adminGroup.Use(middleware.AuthMiddleware("admin"))
	{
		adminGroup.POST("/products", controllers.CreateProduct)
		adminGroup.PUT("/products/:id", controllers.UpdateProduct)
		adminGroup.DELETE("/products/:id", controllers.DeleteProduct)
	}
}
