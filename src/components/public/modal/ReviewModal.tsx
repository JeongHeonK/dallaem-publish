"use client"

import { useRouter } from "next/navigation"

import { ChangeEvent, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

import addReview from "@/actions/addReview"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import CloseBtn from "../CloseBtn"
import ReviewHeartBtn from "../Review/ReviewHeartBtn/ReviewHeartBtn"

interface IReviewModalProp {
  gatheringId: string
}

interface IUserData extends IReviewModalProp {
  score: number
  comment: string
}

const initialValue = {
  score: 0,
  comment: "남겨주신 리뷰는 프로그램 운영 및 다른 회원 분들께 큰 도움이 됩니다.",
}

const ReviewModal = ({ gatheringId }: IReviewModalProp) => {
  const { register, handleSubmit } = useForm<IUserData>()
  const [userInput, setUserInput] = useState(initialValue)
  const [errorMsg, setErrorMsg] = useState("")
  const router = useRouter()
  const queryClient = useQueryClient()
  const addReviewMutation = useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mypage"] })
    },
  })

  const submitHandler: SubmitHandler<IUserData> = async (data) => {
    const userReview = {
      gatheringId,
      score: userInput.score.toString(),
      comment: data.comment,
    }

    addReviewMutation.mutate(userReview)
    router.back()
  }

  const errorHandler = (data: any) => {
    setErrorMsg(data.comment.message)
  }

  const heartChangeHandler = (userClick: number) => {
    setUserInput((prev) => {
      return {
        ...prev,
        score: userClick,
      }
    })
  }

  const inputChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const userComment = e.target.value
    setUserInput((prev) => {
      return {
        ...prev,
        comment: userComment,
      }
    })
  }

  const disabled = addReviewMutation.isPending || errorMsg ? true : undefined

  return (
    <div className="fixed left-0 top-0 h-screen w-screen bg-gray-950/50">
      <form
        onSubmit={handleSubmit(submitHandler, errorHandler)}
        className="absolute left-0 right-0 top-48 z-50 mx-auto w-modal-md rounded-md bg-white p-6 shadow-xl lg:w-modal-lg"
      >
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">리뷰쓰기</h3>
          <CloseBtn />
        </div>
        <ReviewHeartBtn value={userInput.score} setter={heartChangeHandler} />
        <div className="relative pb-6">
          <p className="mb-3 font-semibold">경험에 대해 남겨주세요.</p>
          <textarea
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...register("comment", {
              required: true,
              minLength: {
                value: 10,
                message: "10자 이상 입력하셔야 합니다.",
              },
              maxLength: {
                value: 200,
                message: "200자까지 입력하실 수 있습니다.",
              },
              onChange: inputChangeHandler,
            })}
            rows={5}
            className="w-full resize-none rounded-xl bg-gray-50 px-4 py-2.5"
            placeholder={userInput.comment}
          />
          {errorMsg && <p className="absolute bottom-1 text-red-500">{errorMsg}</p>}
        </div>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            className="border-primary text-primary hover:border-primary/65 hover:text-primary/60 w-1/2 rounded-xl border py-2.5 active:border-orange-700 active:text-orange-700"
            onClick={() => {
              return router.back()
            }}
          >
            취소
          </button>
          <button
            disabled={disabled}
            type="submit"
            className="w-1/2 rounded-xl bg-gray-400 py-2.5 text-white hover:bg-gray-500 active:bg-gray-600"
          >
            리뷰 등록
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReviewModal
