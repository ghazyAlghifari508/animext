import { ReactNode } from 'react'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export default function SectionHeading({ title, subtitle, action }: SectionHeadingProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        {subtitle && (
          <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
