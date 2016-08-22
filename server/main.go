package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/itsjamie/gin-cors"
	"github.com/ygoto3/sample-media-streaming/server/routes"
	"time"
)

func main() {
	r := gin.Default()
	r.Use(cors.Middleware(cors.Config{
		Origins:         "*",
		Methods:         "GET, PUT, POST, DELETE",
		RequestHeaders:  "Origin, Authorization, Content-Type",
		ExposedHeaders:  "",
		MaxAge:          50 * time.Second,
		Credentials:     true,
		ValidateHeaders: false,
	}))

	r.GET("/alive", routes.Alive)
	r.GET("/media/:name", routes.GetMedia)
	r.POST("/transcode/hls", routes.PostTranscodeHLS)
	r.POST("/transcode/dash", routes.PostTranscodeDASH)
	r.POST("/transcode/webm", routes.PostTranscodeWebM)
	r.Run()
	fmt.Println("listen and server on :8080")
}
