package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
    ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
    Username     string    `gorm:"size:50;not null"`
    Email        string    `gorm:"size:100;unique;not null"`
    PasswordHash string    `gorm:"size:255;not null"`
    FullName     string    `gorm:"size:100"`
    Address      string    `gorm:"type:text"`
    PhoneNumber  string    `gorm:"size:15"`
    Role         string    `gorm:"size:10;default:'user'"`
    CreatedAt    time.Time `gorm:"default:now()"`
    UpdatedAt    time.Time `gorm:"default:now()"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
    u.ID = uuid.New()
    return
}