'use client'

import { Skeleton } from '@/components/ui/skeleton'

type SkeletonType = 'hero' | 'content' | 'list' | 'form'

interface SectionSkeletonProps {
  type: SkeletonType
}

function HeroSkeleton() {
  return (
    <div className="space-y-8">
      {/* Banner skeleton */}
      <div className="relative rounded-2xl overflow-hidden">
        <Skeleton className="w-full h-64 sm:h-80 skeleton-shimmer" />
        {/* Banner text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
          <Skeleton className="h-10 w-80 skeleton-shimmer" />
          <Skeleton className="h-5 w-60 skeleton-shimmer" />
          <Skeleton className="h-5 w-48 skeleton-shimmer" />
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/50 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg skeleton-shimmer" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-16 skeleton-shimmer" />
                <Skeleton className="h-3 w-24 skeleton-shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/50 p-5 space-y-3">
            <Skeleton className="h-12 w-12 rounded-lg skeleton-shimmer" />
            <Skeleton className="h-5 w-28 skeleton-shimmer" />
            <Skeleton className="h-3 w-full skeleton-shimmer" />
            <Skeleton className="h-3 w-3/4 skeleton-shimmer" />
          </div>
        ))}
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/50 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg skeleton-shimmer" />
              <Skeleton className="h-5 w-32 skeleton-shimmer" />
            </div>
            <Skeleton className="h-3 w-full skeleton-shimmer" />
            <Skeleton className="h-3 w-5/6 skeleton-shimmer" />
            <Skeleton className="h-3 w-4/6 skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ContentSkeleton() {
  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-56 skeleton-shimmer" />
        <Skeleton className="h-4 w-80 skeleton-shimmer" />
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-lg skeleton-shimmer" />
        ))}
      </div>

      {/* Accordion cards */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/50 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg skeleton-shimmer" />
              <Skeleton className="h-5 flex-1 skeleton-shimmer" />
              <Skeleton className="h-5 w-5 rounded skeleton-shimmer" />
            </div>
            <Skeleton className="h-3 w-full skeleton-shimmer" />
            <Skeleton className="h-3 w-5/6 skeleton-shimmer" />
            <Skeleton className="h-3 w-4/6 skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-48 skeleton-shimmer" />
        <Skeleton className="h-4 w-72 skeleton-shimmer" />
      </div>

      {/* Stats bar */}
      <div className="flex gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-28 rounded-full skeleton-shimmer" />
        ))}
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/50 overflow-hidden space-y-3">
            <Skeleton className="h-40 w-full skeleton-shimmer" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-5 w-3/4 skeleton-shimmer" />
              <Skeleton className="h-3 w-full skeleton-shimmer" />
              <Skeleton className="h-3 w-2/3 skeleton-shimmer" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-5 w-16 rounded-full skeleton-shimmer" />
                <Skeleton className="h-5 w-16 rounded-full skeleton-shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-40 skeleton-shimmer" />
        <Skeleton className="h-4 w-64 skeleton-shimmer" />
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24 skeleton-shimmer" />
            <Skeleton className="h-10 w-full rounded-lg skeleton-shimmer" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 skeleton-shimmer" />
        <Skeleton className="h-28 w-full rounded-lg skeleton-shimmer" />
      </div>
      <Skeleton className="h-10 w-36 rounded-lg skeleton-shimmer" />

      {/* Side info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/50 p-4 space-y-2">
            <Skeleton className="h-8 w-8 rounded-lg skeleton-shimmer" />
            <Skeleton className="h-4 w-24 skeleton-shimmer" />
            <Skeleton className="h-3 w-full skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SectionSkeleton({ type }: SectionSkeletonProps) {
  const skeletons: Record<SkeletonType, React.ReactNode> = {
    hero: <HeroSkeleton />,
    content: <ContentSkeleton />,
    list: <ListSkeleton />,
    form: <FormSkeleton />,
  }

  return (
    <div className="animate-in fade-in-0 duration-200">
      {skeletons[type] || <ContentSkeleton />}
    </div>
  )
}
