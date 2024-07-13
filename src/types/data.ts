interface AnimalData {
  x: number
  y: number
  width: number
  height: number
  dropX: number
  dropY: number
  fileNames: {
    target: string
    glow: string
    drop: string
  }
}

interface ISources {
  [key: string]: AnimalData
}

interface ISourceBackground {
  src: string
  width: number
  height: number
}

interface ISourceSounds {
  [key: string]: string
}

export type { AnimalData, ISources, ISourceBackground, ISourceSounds }
