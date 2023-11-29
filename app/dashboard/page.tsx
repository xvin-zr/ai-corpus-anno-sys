import { redirect } from 'next/navigation'
import React from 'react'

function DashboardPage() {
  redirect('/dashboard/profile')
  return (
    <div>Dashboard Page</div>
  )
}

export default DashboardPage