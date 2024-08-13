import { useCallback, useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"

import { IFilterOption } from "@/types/meeting/meeting"
import { IWishListData } from "@/types/wishlist/wishlist"
import dayjs from "dayjs"

const useWishList = (filter: IFilterOption) => {
  const [wish, setWish] = useState<IWishListData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView({
    threshold: 1,
  })

  const filterAndSort = useCallback(
    (parse: IWishListData[]): IWishListData[] => {
      return parse
        .filter((item) => {
          const filterTypeMappings: { [key: string]: boolean } = {
            DALLAEMFIT: item.type !== "WORKATION",
            OFFICE_STRETCHING: item.type === "OFFICE_STRETCHING",
            MINDFULNESS: item.type === "MINDFULNESS",
            WORKATION: item.type === "WORKATION",
          }

          const matchesType = filterTypeMappings[filter?.type]
          const matchesLocation = !filter?.location || item.location === filter.location
          const matchesDateTime =
            !filter?.date || dayjs(item.dateTime).format("YYYY-MM-DD") === filter.date
          return matchesType && matchesLocation && matchesDateTime
        })
        .sort((a, b) => {
          if (filter.sortBy === "registrationEnd") {
            return dayjs(a.registrationEnd).unix() - dayjs(b.registrationEnd).unix()
          }
          if (filter.sortBy === "dateTime") {
            return dayjs(a.dateTime).unix() - dayjs(b.dateTime).unix()
          }
          if (filter.sortBy === "participantCount") {
            return b.participantCount - a.participantCount
          }
          return 0
        })
    },
    [filter],
  )

  const loadMore = useCallback(() => {
    const storage = JSON.parse(localStorage.getItem("wishlist") || "[]")
    const newItems = filterAndSort(storage).slice(page * 10, (page + 1) * 10)

    if (newItems.length > 0) {
      setWish((prev) => {
        return [...prev, ...newItems]
      })
      setPage((prev) => {
        return prev + 1
      })
    } else {
      setHasMore(false)
    }
  }, [page, filterAndSort])

  useEffect(() => {
    // Initial fetch
    setIsLoading(false)
    const storage = JSON.parse(localStorage.getItem("wishlist") || "[]")
    const newItems = filterAndSort(storage).slice(0, 10)
    setWish(newItems)
    setPage(1)

    if (storage.length === newItems.length) {
      setHasMore(false)
    }
  }, [filter, filterAndSort])

  useEffect(() => {
    if (inView && hasMore) {
      loadMore()
    }
  }, [inView, hasMore, loadMore])

  return { wish, setWish, ref, isLoading, hasMore }
}

export default useWishList
