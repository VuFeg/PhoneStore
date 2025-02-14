package routes

import (
	"ecommerce-project/controllers"
	"ecommerce-project/middleware"

	"github.com/gin-gonic/gin"
)

func VariantRoutes(r *gin.RouterGroup) {
	// Lấy chi tiết một Category theo id
	r.GET("/variants/:id", controllers.GetVariantByID)
	// Lấy danh sách các Category của một sản phẩm cụ thể
	r.GET("/products/:id/variants", controllers.GetVariantsForProduct)

	// --- Các route admin cho Category ---
	admin := r.Group("/admin")
	admin.Use(middleware.AuthMiddleware("admin"))
	{
		// Tạo mới một Category cho sản phẩm (nested route)
		admin.POST("/products/:id/variants", controllers.CreateVariantForProduct)
		// Cập nhật một Category dựa trên id của Category
		admin.PUT("/variants/:id", controllers.UpdateVariant)
		// Nếu cần, bạn có thể thêm route DELETE cho Category
		admin.DELETE("/variants/:id", controllers.DeleteVariant)
	}
}
