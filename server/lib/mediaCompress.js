import sharp from 'sharp'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'

ffmpeg.setFfmpegPath(ffmpegPath)

export const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp'])
export const VIDEO_EXT = new Set(['.mp4', '.mov', '.webm', '.mkv', '.avi'])
export const AUDIO_EXT = new Set(['.mp3', '.m4a', '.wav', '.aac'])

// Resize + recompress images in place, capped at 1920px wide.
export async function compressImage(filePath, ext) {
  const buffer = sharp(filePath).rotate().resize({ width: 1920, withoutEnlargement: true })
  if (ext === '.png') return buffer.png({ quality: 80, compressionLevel: 9 }).toBuffer()
  if (ext === '.webp') return buffer.webp({ quality: 80 }).toBuffer()
  return buffer.jpeg({ quality: 80, mozjpeg: true }).toBuffer()
}

// Transcode video to H.264/AAC mp4, capped at 1280px wide. Always outputs .mp4.
export function compressVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .audioBitrate('128k')
      .outputOptions(['-crf 28', '-preset medium', '-vf', "scale='min(1280,iw)':-2", '-movflags +faststart'])
      .on('error', reject)
      .on('end', resolve)
      .save(outputPath)
  })
}

// Re-encode audio to a lower mp3 bitrate.
export function compressAudio(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioCodec('libmp3lame')
      .audioBitrate('128k')
      .on('error', reject)
      .on('end', resolve)
      .save(outputPath)
  })
}
