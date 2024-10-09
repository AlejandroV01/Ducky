'use client'
import React from 'react'

interface Album {
  params: {
    albumId: string
  }
}

export default function Album({ params }: Album) {
  const { albumId } = params

  return (
    <div>
      <h1 className='text-center text-yellow-500 text-3xl font-bold'>Album</h1>
      <p className='text-center text-yellow-400 text-1xl font-semibold'>Album ID: {albumId}</p>
    </div>
  )
}
