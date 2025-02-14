package config

import (
	"ecommerce-project/models"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func LoadEnv() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}
}

func GetEnv(key string) string {
	return os.Getenv(key)
}

func InitDatabase() {
	dsn := os.Getenv("DATABASE_DSN")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	DB = db

	if err := DB.AutoMigrate(&models.User{}, &models.RefreshToken{}, &models.Product{}, &models.ProductVariant{}, &models.Cart{}, &models.CartItem{}, &models.Category{}); err != nil {
		log.Fatal("Migration failed:", err)
	}
	log.Println("Migration completed successfully!")
}