"use client"

import { useState, useEffect } from "react"
import { CheckCircle } from "lucide-react"

interface CourseProgressIndicatorProps {
  courseId: number
  totalSteps: number
}

export function CourseProgressIndicator({ courseId, totalSteps }: CourseProgressIndicatorProps) {
  const [completedStepsCount, setCompletedStepsCount] = useState(0)

  useEffect(() => {
    const progressKey = `adultech-curso-${courseId}-progress`
    const savedProgress = localStorage.getItem(progressKey)
    if (savedProgress) {
      const completedSteps = JSON.parse(savedProgress)
      setCompletedStepsCount(Object.keys(completedSteps).length)
    }

    // Listen for changes in local storage from other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === progressKey) {
        const updatedProgress = event.newValue ? JSON.parse(event.newValue) : {}
        setCompletedStepsCount(Object.keys(updatedProgress).length)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [courseId])

  if (totalSteps === 0) {
    return <span className="text-sm text-slate-500 dark:text-slate-400">Sin pasos definidos</span>
  }

  const progressPercentage = (completedStepsCount / totalSteps) * 100

  return (
    <div className="mt-4 text-sm text-slate-600 dark:text-slate-300 flex items-center justify-center">
      {progressPercentage === 100 ? (
        <span className="text-green-600 dark:text-green-400 font-semibold flex items-center">
          <CheckCircle className="h-4 w-4 mr-1" />
          Completado
        </span>
      ) : (
        <span>
          Progreso: {completedStepsCount}/{totalSteps} pasos
        </span>
      )}
    </div>
  )
}
