import clsx from 'clsx'
import React, { HTMLAttributes } from 'react'

interface PageWrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className, ...props }) => {
  return (
    <div className={clsx('flex flex-col items-center py-10 w-full lg:w-[calc(100%-16rem)] ml-auto  px-4', className)} {...props}>
      {children}
    </div>
  )
}

export default PageWrapper
