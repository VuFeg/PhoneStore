package utils

import (
	"ecommerce-project/config"
	"ecommerce-project/models"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

func GenerateTokens(user models.User) (string, string, error) {
    // Access token (60 phút)
    accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "sub": user.ID.String(),
        "role": user.Role,
        "exp": time.Now().Add(60 * time.Minute).Unix(),
    })

    // Refresh token (7 ngày)
    refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "sub": user.ID.String(),
        "role": user.Role,
        "exp": time.Now().Add(7 * 24 * time.Hour).Unix(),
    })

    accessTokenString, err := accessToken.SignedString([]byte(config.GetEnv("ACCESS_TOKEN_SECRET")))
    if err != nil {
        return "", "", err
    }

    refreshTokenString, err := refreshToken.SignedString([]byte(config.GetEnv("REFRESH_TOKEN_SECRET")))
    if err != nil {
        return "", "", err
    }

    return accessTokenString, refreshTokenString, nil
}

func ParseToken(tokenString string, secretKey string) (uuid.UUID, string, error) {
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        return []byte(secretKey), nil
    })

    if err != nil {
        return uuid.Nil, "", err
    }

    if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
        userID, err := uuid.Parse(claims["sub"].(string))
        if err != nil {
            return uuid.Nil, "", err
        }

        role, ok := claims["role"].(string)
        if !ok {
            return uuid.Nil, "", jwt.ErrInvalidKey
        }

        return userID, role, nil
    }

    return uuid.Nil, "", jwt.ErrInvalidKey
}