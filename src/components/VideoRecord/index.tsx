import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { useReactMediaRecorder } from 'react-media-recorder-2'

import { Chip, Container, Grid } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import PlayCircle from '@mui/icons-material/PlayCircle'
import StopCircle from '@mui/icons-material/StopCircle'
import PendingOutlined from '@mui/icons-material/PendingOutlined'
import Time from '@mui/icons-material/Timelapse'

import Item from './components/Item'
import { Status } from './types'

import { sendVideo } from '../../api'
import Config from '../../config'

const VideoRecord = () => {
  const [videoDuration, setVideoDuration] = useState(0)
  const [dataProcessing, setDataProcessing] = useState(false)
  const [videoDurationTimer, setVideoDurationTimer] =
    useState<null | NodeJS.Timer>(null)
  const { status, previewStream, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      video: {
        width: 320,
        height: 240,
        facingMode: 'user',
        frameRate: Config.videoFrameRate,
      },
      ...(!Config.videoAudioRecord && {
        audio: false,
        mediaRecorderOptions: { audioBitsPerSecond: 0 },
      }),
    })

  const toggleRecording = () => {
    if (status === Status.ACQUIRING_MEDIA) return

    if (status === Status.IDLE || status === Status.STOPPED) {
      startRecording()
    } else {
      stopRecording()
    }
  }

  useEffect(() => {
    if (videoDuration >= 10) {
      stopRecording()
      setDataProcessing(true)
    }
  }, [videoDuration, stopRecording])

  useEffect(() => {
    const sendVideoData = async () => {
      if (mediaBlobUrl) {
        await sendVideo(mediaBlobUrl)

        setDataProcessing(false)
      }
    }

    sendVideoData()
  }, [mediaBlobUrl])

  useEffect(() => {
    if (status === Status.STOPPED || status === Status.STOPPING) {
      if (videoDurationTimer) {
        clearInterval(videoDurationTimer)
        setDataProcessing(true)
        setVideoDuration(0)
      }
    }

    if (status === Status.RECORDING) {
      setVideoDuration(0)

      if (videoDurationTimer) {
        clearInterval(videoDurationTimer)
      }

      const timer = setInterval(() => {
        setVideoDuration((prev) => prev + 1)
      }, 1000)

      setVideoDurationTimer(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  return (
    <Container maxWidth="md">
      <Grid container>
        <Grid item md={12} alignItems="center">
          <ReactPlayer
            className="react-player"
            style={{ display: 'block' }}
            config={{ file: { forceAudio: false } }}
            width="100%"
            playing={
              status === Status.RECORDING || status === Status.STOPPED
                ? true
                : false
            }
            url={status === Status.RECORDING ? previewStream! : mediaBlobUrl}
            controls={status === Status.RECORDING ? false : true}
            autoPlay
          />
        </Grid>
      </Grid>
      <Grid marginTop={5}>
        <Item>
          <IconButton
            disabled={
              status === Status.ACQUIRING_MEDIA || (dataProcessing && true)
            }
            color={status === Status.RECORDING ? 'error' : 'primary'}
            size="large"
            onClick={toggleRecording}
          >
            {dataProcessing ? (
              <PendingOutlined />
            ) : status === Status.IDLE || status === Status.STOPPED ? (
              <PlayCircle />
            ) : (
              <StopCircle />
            )}
          </IconButton>
          <Chip
            icon={
              dataProcessing ? undefined : (
                <Time
                  className={status === Status.RECORDING ? 'icon-spin' : ''}
                />
              )
            }
            label={
              <div className="label-padding">
                {dataProcessing
                  ? 'Processing..'
                  : `Duration: ${videoDuration} seconds`}
              </div>
            }
          />
        </Item>
      </Grid>
    </Container>
  )
}

export default VideoRecord
