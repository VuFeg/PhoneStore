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

	if err := DB.AutoMigrate(&models.User{}, &models.RefreshToken{}); err != nil {
		log.Fatal("Migration failed:", err)
	}
	log.Println("Migration completed successfully!")
}

type Config struct {
	App struct {
		Host string `envconfig:"APP_HOST"`
		PORT string `envconfig:"APP_PORT"`
	}
	Database struct {
		Host     string `envconfig:"DB_HOST"`
		Name     string `envconfig:"DB_NAME"`
		Port     string `envconfig:"DB_PORT"`
		User     string `envconfig:"DB_USER"`
		Password string `envconfig:"DB_PASSWORD"`
		SSLMode  string `envconfig:"DB_SSLMODE"`
	}
	Auth struct {
		JWTSecret        string `envconfig:"JWT_SECRET" default:"token-secret"`
		TokenExpire      int    `envconfig:"TOKEN_EXPIRE" default:"60"`
		ShortTokenExpire int    `envconfig:"SHORT_TOKEN_EXPIRE" default:"15"`
	}
	SMTP struct {
		Email             string `envconfig:"SMTP_EMAIL"`
		Password          string `envconfig:"SMTP_PASSWORD"`
		LinkResetPassword string `envconfig:"SMTP_LINK_RESET_PSW"`
	}
	Supabase struct {
		URL    string `envconfig:"SUPABASE_URL" required:"true"`
		Key    string `envconfig:"SUPABASE_KEY" required:"true"`
		Bucket string `envconfig:"SUPABASE_BUCKET" required:"true"`
	}
	VnPay struct {
		Secret     string `envconfig:"VNPAY_SECRET"`
		TmnCode    string `envcofig:"VNPAY_TMNCODE"`
		ReturnUrl  string `envconfig:"VNPAY_RETURN_URL"`
		CancelUrl  string `envconfig:"VNPAY_CANCEL_URL"`
		SuccessUrl string `envconfig:"VNPAY_SUCCESS_URL"`
		ErrorUrl   string `envconfig:"VNPAY_ERROR_URL"`
	}
	PayPal struct {
		ClientId   string `envconfig:"PAYPAL_CLIENT"`
		SecretKey  string `envconfig:"PAYPAL_SECRET_KEY"`
		ReturnUrl  string `envconfig:"PAYPAL_RETURN_URL"`
		SuccessUrl string `envconfig:"PAYPAL_SUCCESS_URL"`
	}
	ExchangeMoneyApi struct {
		Url string `envconfig:"EXCHANGE_MONEY_API"`
	}
	Environment struct {
		Env string `envconfig:"ENVIRONMENT"`
	}
}

var appConfig = &Config{}

func AppConfig() *Config {
	return appConfig
}