package routes

import (
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		AuthRoutes(api)
		UserRoutes(api)
		ProductRoutes(api)
		MediaRoutes(api)
		CategoryProductRoutes(api)
		CartRoutes(api)
		VariantRoutes(api)
	}

}
