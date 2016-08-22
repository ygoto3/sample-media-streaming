package transcoder

import (
	"log"
	"os/exec"
)

func ToDASH(filename string) error {
	cmd := exec.Command(
		"ffmpeg",
		"-i", "./tmp/"+filename,
		"-vcodec", "libx264",
		"-vb", "500k", // 動画のビットレート
		"-r", "30", // フレームレート
		"-x264opts", "no-scenecut",
		"-g", "15", // キーフレーム間隔
		"-acodec", "aac",
		"-ac", "2",
		"-ab", "128k", // 音声のビットレート
		"-frag_duration", "5000000", // フラグメントの時間長
		"-movflags", "frag_keyframe+empty_moov",
		"./tmp/"+filename,
	)
	if err := cmd.Start(); err != nil {
		log.Printf("Error starting command: %v", err)
		return err
	}
	cmd.Wait()

	cmd = exec.Command(
		"MP4Box",
		"-frag", "4000",
		"-dash", "4000", // フラグメントの時間長
		"-rap",
		"-segment-name", filename,
		"-out", "./storage/"+filename,
		"./tmp/"+filename,
	)
	if err := cmd.Start(); err != nil {
		log.Printf("Error starting command: %v", err)
		return err
	}
	cmd.Wait()
	return nil
}

func ToHLS(filename string) error {
	cmd := exec.Command(
		"ffmpeg",
		"-i", "./tmp/"+filename,
		"-f", "hls",
		"-hls_time", "10",
		"./storage/"+filename+".m3u8",
	)
	if err := cmd.Start(); err != nil {
		log.Printf("Error starting command: %v", err)
		return err
	}
	cmd.Wait()
	return nil
}

func ToWebM(filename string) error {
	cmd := exec.Command(
		"ffmpeg",
		"-i", "./tmp/"+filename,
		"-codec:v", "libvpx",
		"-quality", "good",
		"-cpu-used", "0",
		"-b:v", "500k",
		"-qmin", "10",
		"-qmax", "42",
		"-maxrate", "500k",
		"-bufsize", "1000k",
		"-threads", "4",
		"-vf", "scale=-1:480",
		"-codec:a", "libvorbis",
		"-b:a", "128k",
		"./storage/"+filename+".webm",
	)
	if err := cmd.Start(); err != nil {
		log.Printf("Error starting command: %v", err)
		return err
	}
	cmd.Wait()
	return nil
}
