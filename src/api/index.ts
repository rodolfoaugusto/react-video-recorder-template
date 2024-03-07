import Config from '../config'

export const sendVideo = async (videoUrl: string) => {
  const videoBlob = await urlToBlob(videoUrl)

  const formData = new FormData()
  formData.append('video', videoBlob)

  const response = await fetch(`${Config.apiBaseUrl}/myBucket`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload video')
  }
}

const urlToBlob = async (url: string) => {
  const response = await fetch(url)

  const blob = await response.blob()

  return blob
}
