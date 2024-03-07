interface Config {
  apiBaseUrl: string
  videoAudioRecord: boolean
  videoMaxRecordDuration: number
  videoFrameRate: number
}

export default {
  videoAudioRecord:
    process.env.REACT_APP_VIDEO_AUDIO_RECORD === 'true' ? true : false,
  videoMaxRecordDuration: process.env.REACT_APP_VIDEO_MAX_RECORD_DURATION
    ? +process.env.REACT_APP_VIDEO_MAX_RECORD_DURATION
    : 10,
  videoFrameRate: process.env.REACT_APP_VIDEO_FRAME_RATE
    ? +process.env.REACT_APP_VIDEO_FRAME_RATE
    : 15,
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || '',
} as Config
