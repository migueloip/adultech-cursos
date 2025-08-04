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
    <div className="mt-4 space-y-2">
      {/* Barra de progreso visual */}
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Texto del progreso */}
      <div className="text-sm text-slate-600 dark:text-slate-300 flex items-center justify-between">
        <span className="font-medium">
          Progreso: {completedStepsCount}/{totalSteps} pasos
        </span>
        
        {progressPercentage === 100 ? (
          <span className="text-green-600 dark:text-green-400 font-semibold flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            Completado
          </span>
        ) : (
          <span className="text-blue-600 dark:text-blue-400 font-semibold">
            {Math.round(progressPercentage)}%
          </span>
        )}
      </div>
    </div>
  )
}
