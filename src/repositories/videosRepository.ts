import { Resolutions, VideoType } from '../types';

export let videos: VideoType[] = []


export const videosRepository = {
  getVideos() {
    return videos
  },
  getVideoById(id: number) {
    return videos.find((item) => item.id === +id)
  },
  deleteVideoById(id: number) {
    const video = videos.find((item) => item.id === +id)
    if (video) {
      const index = videos.indexOf(video)
      if (index > -1) {
        videos.splice(index, 1);
        return true
      }
    }
    return false
  },
  createVideo(title: string, author: string, availableResolutions: Resolutions[]) {
    const newVideo: VideoType = {
      title,
      author,
      availableResolutions,
      id: Math.floor(Math.random() * 100),
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: new Date(Date.now() + (3600 * 1000 * 24)).toISOString(),
    }
    videos.push(newVideo);
    return newVideo
  },
  updateVideoById({
    id,
    title, author, availableResolutions, minAgeRestriction, publicationDate,
    canBeDownloaded
  }: Partial<VideoType>) {
    const video = videos.find(video => video.id === id!)
    if (video) {
      video.title = title!;
      video.author = author!;
      video.availableResolutions = availableResolutions!;
      video.minAgeRestriction = +minAgeRestriction!;
      video.publicationDate = publicationDate!;
      video.canBeDownloaded = canBeDownloaded!;
      return true
    }
    return false
  }
}