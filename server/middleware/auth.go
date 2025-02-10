package middleware

import (
	"ecommerce-project/config"
	"ecommerce-project/utils"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(allowedRoles ...string) gin.HandlerFunc {
    return func(c *gin.Context) {
        token := strings.Split(c.GetHeader("Authorization"), " ")[1]
        if token == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization required"})
            c.Abort()
            return
        }

        fmt.Println(token)

        userID, role, err := utils.ParseToken(token, config.GetEnv("ACCESS_TOKEN_SECRET"))
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        // Kiểm tra quyền truy cập
        for _, allowedRole := range allowedRoles {
            if role == allowedRole {
                c.Set("userID", userID)
                c.Set("role", role)
                c.Next()
                return
            }
        }

        c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
        c.Abort()
    }
}
