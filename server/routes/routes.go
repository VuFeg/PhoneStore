package routes

import (
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/")

	AuthRoutes(api)
	UserRoutes(api)
	// Thêm các module khác vào đây sau này
}
