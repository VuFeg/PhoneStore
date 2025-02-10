package routes

import (
	"ecommerce-project/controllers"
	"ecommerce-project/middleware"

	"github.com/gin-gonic/gin"
)

// CartRoutes định nghĩa các routes cho quản lý giỏ hàng
// Các endpoint này được nhóm dưới đường dẫn "/cart" và được bảo vệ bởi middleware AuthMiddleware.
func CartRoutes(r *gin.RouterGroup) {
	// Tạo nhóm con "cart" và áp dụng middleware xác thực,
	// cho phép người dùng có role "user" hoặc "admin" truy cập.
	cartGroup := r.Group("/cart")
	cartGroup.Use(middleware.AuthMiddleware("user", "admin"))
	{
		// Thêm mặt hàng vào giỏ hàng
		cartGroup.POST("/items", controllers.AddCartItem)
		// Lấy danh sách mặt hàng trong giỏ hàng (bao gồm cả thông tin Cart và CartItem)
		cartGroup.GET("/items", controllers.GetCartItems)
		// Cập nhật số lượng của một mặt hàng trong giỏ hàng
		cartGroup.PUT("/items/:id", controllers.UpdateCartItem)
		// Xoá một mặt hàng khỏi giỏ hàng
		cartGroup.DELETE("/items/:id", controllers.DeleteCartItem)
		// Xoá toàn bộ giỏ hàng của người dùng
		cartGroup.DELETE("/clear", controllers.ClearCart)
		// Thanh toán giỏ hàng: xử lý thanh toán cho toàn bộ Cart,
		// sau đó xoá toàn bộ CartItem khỏi Cart.
		cartGroup.POST("/checkout", controllers.CheckoutCart)
	}
}
