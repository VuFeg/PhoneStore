package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

var Validate *validator.Validate

func init() {
	Validate = validator.New()
}

func HandleValidationError(c *gin.Context, err error) {
	if errs, ok := err.(validator.ValidationErrors); ok {
		errorMessages := make(map[string]string)
		for _, e := range errs {
			switch e.Tag() {
			case "required":
				errorMessages[e.Field()] = e.Field() + " không được để trống!"
			case "email":
				errorMessages[e.Field()] = "Email không hợp lệ!"
			case "min":
				errorMessages[e.Field()] = e.Field() + " phải có ít nhất " + e.Param() + " ký tự!"
			case "max":
				errorMessages[e.Field()] = e.Field() + " không được vượt quá " + e.Param() + " ký tự!"
			default:
				errorMessages[e.Field()] = "Giá trị không hợp lệ cho trường " + e.Field()
			}
		}
		c.JSON(http.StatusBadRequest, gin.H{"errors": errorMessages})
		return
	}
	c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
}