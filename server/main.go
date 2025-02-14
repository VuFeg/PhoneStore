package main

import (
	"ecommerce-project/config"
	"ecommerce-project/docs"
	"ecommerce-project/middleware"
	"ecommerce-project/routes"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
    config.LoadEnv()
    config.InitSupabase()
    config.InitDatabase()
    config.InitStorageClient()

    r := gin.Default()

    r.Use(middleware.CORSMiddleware())
    

    docs.InitSwagger(r)
    routes.SetupRoutes(r)

    fmt.Println("Server is running on port 8080")
    log.Fatal(http.ListenAndServe(":8080", r))
}