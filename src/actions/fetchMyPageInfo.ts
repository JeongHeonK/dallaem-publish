"use server"

import { cookies } from "next/headers"

import { IGathering } from "@/types/review/filter"

interface IGetMyMeetings {
  limit: number
  offset: number
  sortBy?: "dateTime" | "registrationEnd" | "joinedAt"
  sortOrder?: "asc" | "desc"
}

interface IFetchMyPageInfo extends IGetMyMeetings {
  fetchingKey?: string
  isReviewed?: boolean | null
}

interface CustomErr {
  [key: string]: string
}

export interface IGetMyPageRes {
  teamId: string
  id: number
  type: string
  name: string
  dateTime: string
  registrationEnd: string
  location: string
  participantCount: number
  capacity: number
  image: string
  createdBy: number
  canceledAt: string
  joinedAt: string
  isReviewed: boolean
}

export interface IReview {
  teamId: string
  id: number
  userId: number
  gatheringId: number
  score: number
  comment: string
  createdAt: string
  Gathering: IGathering
}

export const getMyMeetings = async (
  options: IFetchMyPageInfo,
): Promise<IGetMyPageRes[] | string> => {
  const userToken = cookies().get("userToken")?.value
  const { limit = 5, offset, isReviewed } = options
  const reviewed = isReviewed ? "&reviewed=true" : ""

  try {
    const response = await fetch(
      `${process.env.BASE_URL}/${process.env.TEAM_ID}/gatherings/joined?limit=${limit}&offset=${offset}${reviewed}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    )
    if (response.status === 401) throw new Error("Authorization 헤더가 없습니다")
    if (response.status === 400) throw new Error("limit는 최소 1이어야 합니다")
    return await response.json()
  } catch (err) {
    const error = err as CustomErr

    return error.message
  }
}

export const getMyReview = async (offset: number, limit: number) => {
  const userToken = cookies().get("userToken")?.value
  try {
    const userResponse = await fetch(`${process.env.BASE_URL}/${process.env.TEAM_ID}/auths/user`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
    const { id } = await userResponse.json()
    const response = await fetch(
      `${process.env.BASE_URL}/${process.env.TEAM_ID}/reviews?userId=${id}&limit=${limit}&offset=${offset}`,
    )
    if (response.status === 400) {
      throw new Error("로그인 정보를 확인해주세요")
    }
    return await response.json()
  } catch (err) {
    const error = err as CustomErr

    return error.message
  }
}

export const getMyOwnMeeting = async (
  offset: number,
  limit: number,
): Promise<IGetMyPageRes[] | string> => {
  const userToken = cookies().get("userToken")?.value
  try {
    const userRes = await fetch(`${process.env.BASE_URL}/${process.env.TEAM_ID}/auths/user`, {
      method: "GET",
      headers: { Authorization: `Bearer ${userToken}` },
    })

    const { id } = await userRes.json()
    const response = await fetch(
      `${process.env.BASE_URL}/${process.env.TEAM_ID}/gatherings?createdBy=${id}&offset=${offset}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    )
    if (response.status === 400) {
      throw new Error("로그인 정보를 확인해주세요")
    }
    return await response.json()
  } catch (err) {
    const error = err as CustomErr

    return error.message
  }
}

export const fetchMyPageInfo = async (options: IFetchMyPageInfo) => {
  const { fetchingKey = "myMeeting", offset, limit, isReviewed, ...args } = options
  switch (fetchingKey) {
    case "myMeeting":
      return getMyMeetings({ offset, limit, ...args })
    case "myReview":
      if (isReviewed) {
        return getMyReview(offset, limit)
      }
      return getMyMeetings({ offset, limit, isReviewed })
    case "myOwnMeeting":
      return getMyOwnMeeting(offset, limit)
    default:
      return "잘못된 요청 종류입니다."
  }
}
