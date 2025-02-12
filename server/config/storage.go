package config

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"sync"

	"github.com/google/uuid"
	"github.com/supabase-community/supabase-go"
)

var supabaseClient *supabase.Client

func InitStorageClient() {
    supabaseUrl := os.Getenv("SUPABASE_URL")
    supabaseKey := os.Getenv("SUPABASE_KEY")

    client, err := supabase.NewClient(supabaseUrl, supabaseKey, nil)
	if err != nil {
		log.Fatal("Lỗi khởi tạo Supabase client:", err)
		log.Println("Supabase client initialized:", supabaseClient)
	}

	supabaseClient = client
}

type Storage interface {
    UploadFile(file *multipart.FileHeader) (string, error)
    DeleteFile(filename string) error
}

type SupabaseStorage struct {
    url    string
    key    string
    bucket string
    client *http.Client
}

var (
    instance Storage
    once     sync.Once
)

func GetStorage() (Storage, error) {
    var err error
    once.Do(func() {
        instance, err = newSupabaseStorage()
    })
    return instance, err
}

func newSupabaseStorage() (Storage, error) {
    return &SupabaseStorage{
        url:    os.Getenv("SUPABASE_URL"),
        key:    os.Getenv("SUPABASE_KEY"),
        bucket: os.Getenv("SUPABASE_BUCKET"),
        client: &http.Client{},
    }, nil
}

func (s *SupabaseStorage) DeleteFile(filename string) error {
	// Xây dựng URL cho việc xóa file
	url := fmt.Sprintf("%s/storage/v1/object/%s/%s", s.url, s.bucket, filename)
	req, err := http.NewRequest(http.MethodDelete, url, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	// Thiết lập header Authorization bằng Supabase Service Key
	req.Header.Set("Authorization", "Bearer "+os.Getenv("SUPABASE_SERVICE_KEY"))

	resp, err := s.client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	// Kiểm tra status code: chấp nhận các mã 2xx
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("delete failed with status %d: %s", resp.StatusCode, string(body))
	}

	return nil
}

func (s *SupabaseStorage) UploadFile(file *multipart.FileHeader) (string, error) {
    fileContent, err := s.readFile(file)
    if err != nil {
        return "", fmt.Errorf("failed to read file: %w", err)
    }

    filename := s.generateFilename(file.Filename)
    fmt.Println(filename)
    
    if err := s.uploadToSupabase(fileContent, filename, file.Header.Get("Content-Type")); err != nil {
        fmt.Println("123123")
        return "", err
    }


    return s.generatePublicURL(filename), nil
}

func (s *SupabaseStorage) readFile(file *multipart.FileHeader) ([]byte, error) {
    src, err := file.Open()
    if err != nil {
        return nil, err
    }
    defer src.Close()

    return io.ReadAll(src)
}

func (s *SupabaseStorage) generateFilename(originalName string) string {
    ext := filepath.Ext(originalName)
    return fmt.Sprintf("%s%s", uuid.New().String(), ext)
}

func (s *SupabaseStorage) uploadToSupabase(content []byte, filename, contentType string) error {
    url := fmt.Sprintf("%s/storage/v1/object/%s/%s", s.url, s.bucket, filename)

    // Kiểm tra Content-Type
    if contentType == "" {
        contentType = "application/octet-stream"
    }
    
    // Thử dùng PUT thay vì POST
    req, err := http.NewRequest(http.MethodPut, url, bytes.NewReader(content))
    if err != nil {
        fmt.Println("Error tạo request")
        return fmt.Errorf("failed to create request: %w", err)
    }

    req.Header.Set("Content-Type", contentType)
    req.Header.Set("Authorization", "Bearer "+os.Getenv("SUPABASE_SERVICE_KEY"))

    resp, err := s.client.Do(req)
    if err != nil {
        fmt.Println("Error gửi request")
        return fmt.Errorf("failed to send request: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        body, _ := io.ReadAll(resp.Body)
        return fmt.Errorf("upload failed with status %d: %s", resp.StatusCode, string(body))
    }

    fmt.Println("Upload thành công")
    return nil
}


func (s *SupabaseStorage) generatePublicURL(filename string) string {
    return fmt.Sprintf("%s/storage/v1/object/public/%s/%s",
        s.url,
        s.bucket,
        filename,
    )
}

