package routes

import (
	"ecommerce-project/controllers"
	"ecommerce-project/middleware"

	"github.com/gin-gonic/gin"
)

// CategoryRoutes định nghĩa các routes cho phiên bản (Category) của sản phẩm
func CategoryRoutes(r *gin.RouterGroup) {
	// --- Các route public cho Category ---
	// Lấy chi tiết một Category theo id
	r.GET("/categories/:id", controllers.GetCategoryByID)
	// Lấy danh sách các Category của một sản phẩm cụ thể
	r.GET("/products/:id/categories", controllers.GetCategoriesForProduct)

	// --- Các route admin cho Category ---
	admin := r.Group("/admin")
	admin.Use(middleware.AuthMiddleware("admin"))
	{
		// Tạo mới một Category cho sản phẩm (nested route)
		admin.POST("/products/:id/categories", controllers.CreateCategoryForProduct)
		// Cập nhật một Category dựa trên id của Category
		admin.PUT("/categories/:id", controllers.UpdateCategory)
		// Nếu cần, bạn có thể thêm route DELETE cho Category
		// admin.DELETE("/categories/:id", controllers.DeleteCategory)
	}
}
