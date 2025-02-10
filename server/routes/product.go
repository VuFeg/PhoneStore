package routes

import (
	"ecommerce-project/controllers"
	"ecommerce-project/middleware"

	"github.com/gin-gonic/gin"
)

// ProductRoutes định nghĩa các routes cho sản phẩm (public và admin)
func ProductRoutes(r *gin.RouterGroup) {
	// --- Các route public ---
	r.GET("/products", controllers.GetProducts)
	r.GET("/products/:id", controllers.GetProduct)

	// --- Các route admin cho sản phẩm ---
	admin := r.Group("/admin")
	admin.Use(middleware.AuthMiddleware("admin"))
	{
		admin.POST("/products", controllers.CreateProduct)
		admin.PUT("/products/:id", controllers.UpdateProduct)
		admin.DELETE("/products/:id", controllers.DeleteProduct)
	}
}
