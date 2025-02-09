package config

import (
	"log"
	"os"

	"github.com/nedpals/supabase-go"
)

var Supabase *supabase.Client

func InitSupabase() {
	Supabase = supabase.CreateClient(
		os.Getenv("SUPABASE_URL"),
		os.Getenv("SUPABASE_KEY"),
	)

	if Supabase == nil {
		log.Fatal("Failed to initialize Supabase client")
	}
}
