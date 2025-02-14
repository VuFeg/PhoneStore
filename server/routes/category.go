package routes

import (
	"ecommerce-project/controllers"
	"ecommerce-project/middleware"

	"github.com/gin-gonic/gin"
)

// CategoryRoutes defines the routes for managing categories
func CategoryProductRoutes(r *gin.RouterGroup) {
    r.GET("/categories", controllers.GetCategories)
    r.GET("/categproes/:id", controllers.GetCategory)

    admin := r.Group("/admin")
    admin.Use(middleware.AuthMiddleware("admin"))
    {
        admin.POST("/categories", controllers.CreateCategory)
        admin.PUT("/categories/:id", controllers.UpdateCategory)
        admin.DELETE("/categories/:id", controllers.DeleteCategory)
     }
}