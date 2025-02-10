package routes

import (
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/")

	AuthRoutes(api)
	UserRoutes(api)
	ProductRoutes(api)
	MediaRoutes(api)
	CategoryRoutes(api)
}
