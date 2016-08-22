package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ygoto3/sample-media-streaming/server/transcoder"
	"io"
	"io/ioutil"
	"os"
)

func Alive(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "alive",
	})
}

func GetMedia(c *gin.Context) {
	name := c.Params.ByName("name")
	b, err := ioutil.ReadFile("./storage/" + name)
	if err != nil {
		resErr(c, 404, err)
		return
	}
	c.Header("Content-Type", "application/x-mpegURL; charset=utf-8")
	c.String(200, string(b))
}

func PostTranscodeDASH(c *gin.Context) {
	file, header, err := c.Request.FormFile("upload")
	if err != nil {
		resErr(c, 400, err)
		return
	}
	filename := header.Filename
	out, err := os.Create("./tmp/" + filename)
	if err != nil {
		resErr(c, 500, err)
		return
	}
	defer out.Close()
	_, err = io.Copy(out, file)
	if err != nil {
		resErr(c, 500, err)
		return
	}
	if err = transcoder.ToDASH(filename); err != nil {
		resErr(c, 500, err)
		return
	}
	if err = os.Remove("./tmp/" + filename); err != nil {
		resErr(c, 500, err)
		return
	}
	c.JSON(200, gin.H{
		"message": "Successfully transcoded",
	})
}

func PostTranscodeHLS(c *gin.Context) {
	file, header, err := c.Request.FormFile("upload")
	if err != nil {
		resErr(c, 400, err)
		return
	}
	filename := header.Filename
	out, err := os.Create("./tmp/" + filename)
	if err != nil {
		resErr(c, 500, err)
		return
	}
	defer out.Close()
	_, err = io.Copy(out, file)
	if err != nil {
		resErr(c, 500, err)
		return
	}
	if err = transcoder.ToHLS(filename); err != nil {
		resErr(c, 500, err)
		return
	}
	if err = os.Remove("./tmp/" + filename); err != nil {
		resErr(c, 500, err)
		return
	}
	c.JSON(200, gin.H{
		"message": "Successfully transcoded",
	})
}

func PostTranscodeWebM(c *gin.Context) {
	file, header, err := c.Request.FormFile("upload")
	if err != nil {
		resErr(c, 400, err)
		return
	}
	filename := header.Filename
	out, err := os.Create("./tmp/" + filename)
	if err != nil {
		resErr(c, 500, err)
		return
	}
	defer out.Close()
	_, err = io.Copy(out, file)
	if err != nil {
		resErr(c, 500, err)
		return
	}
	if err = transcoder.ToWebM(filename); err != nil {
		resErr(c, 500, err)
		return
	}
	if err = os.Remove("./tmp/" + filename); err != nil {
		resErr(c, 500, err)
		return
	}
	c.JSON(200, gin.H{
		"message": "Successfully transcoded",
	})
}

func resErr(c *gin.Context, code int, err error) {
	c.Error(err)
	c.String(code, err.Error())
}
