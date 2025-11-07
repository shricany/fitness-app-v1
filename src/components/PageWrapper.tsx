import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface PageWrapperProps {
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  children: ReactNode
}

export default function PageWrapper({ title, description, action, children }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
          {action && (
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
        </div>
      </div>
      <div className="p-8">
        {children}
      </div>
    </div>
  )
}