import { ReactNode } from 'react'

import { Helmet } from 'react-helmet'


interface PageTitleProps {
  subName?: string
  title: string
  addedChild?: ReactNode
}
const PageBreadcrumb = ({ subName, title, addedChild }: PageTitleProps) => {
  return (
    <>
      <Helmet>
        <title>{title} | Window - React Admin & Dashboard</title>
      </Helmet>
      {subName && (
        <div className="mt-2 mb-4 mb-md-6">
          <h4 className="fw-semibold">{title}</h4>
        </div>
      )}
    </>
  )
}

export default PageBreadcrumb
