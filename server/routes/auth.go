package routes

import (
	"ecommerce-project/controllers"
	"ecommerce-project/middleware"

	"github.com/gin-gonic/gin"
)

func AuthRoutes(r *gin.RouterGroup) {
	auth := r.Group("/auth")
	{
		auth.POST("/register", controllers.Register)
		auth.POST("/login", controllers.Login)
		
		auth.POST("/refresh", controllers.Refresh)
		auth.Use(middleware.AuthMiddleware("user", "admin"))
		{
			auth.GET("/me", controllers.CheckMe)
			auth.POST("/logout", controllers.Logout)
		}
	}
}