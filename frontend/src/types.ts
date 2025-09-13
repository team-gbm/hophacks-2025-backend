export type Post = {
  id: number | string
  user: string
  condition: string
  content: string
  time: string
  likes: number
  comments: number
}

export type Connection = {
  id: number | string
  name: string
  condition: string
  journey: string
  location: string
  status: string
}

export type Game = {
  id: number | string
  title: string
  description: string
  category: string
  difficulty: string
}

export type UserProfile = {
  name: string
  age: number
  location: string
  bio: string
  condition: string
  diagnosisDate: string
  hospital: string
  doctor: string
  treatment: string
  medications: string[]
  progress: string
  goals: string
}
