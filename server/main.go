package main

import (
	"ecommerce-project/config"
	"ecommerce-project/docs"
	"ecommerce-project/routes"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// @title Ecommerce API
// @version 1.0
// @description API for Ecommerce platform
// @host localhost:8080
// @BasePath /
func main() {
	config.LoadEnv()
	config.InitSupabase()
	config.InitDatabase()

	r := gin.Default()
	docs.InitSwagger(r)
	routes.SetupRoutes(r)

	fmt.Println("Server is running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}