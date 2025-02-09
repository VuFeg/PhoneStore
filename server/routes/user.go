package routes

import (
	"ecommerce-project/controllers"
	"ecommerce-project/middleware"

	"github.com/gin-gonic/gin"
)

func UserRoutes(r *gin.RouterGroup) {
	protected := r.Group("/user")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.GET("/me", controllers.Me)
	}
}
