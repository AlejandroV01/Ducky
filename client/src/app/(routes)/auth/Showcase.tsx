/* eslint-disable @next/next/no-img-element */
import { motion } from 'framer-motion'
import React from 'react'

const Showcase = () => {
  const images = [
    ['Portrait1.svg', 'Portrait2.svg', 'Portrait3.svg', 'Portrait4.svg'],
    ['Portrait5.svg', 'Portrait6.svg', 'Portrait7.svg', 'Portrait1.svg'],
    ['Portrait2.svg', 'Portrait3.svg', 'Portrait4.svg', 'Portrait5.svg'],
  ]

  const singleSetHeight = 4 * 240

  const scrollUpAnimation = {
    y: [0, -singleSetHeight],
    transition: {
      repeat: Infinity,
      duration: 90,
      ease: 'linear',
    },
  }

  const scrollDownAnimation = {
    y: [-singleSetHeight, 0],
    transition: {
      repeat: Infinity,
      duration: 90,
      ease: 'linear',
    },
  }

  return (
    <div className='max-[1250px]:hidden bg-ducky-bg h-screen w-[56%] overflow-hidden'>
      <div className='flex justify-center gap-32'>
        {images.map((imageSet, columnIndex) => {
          const duplicatedImages = [...imageSet, ...imageSet, ...imageSet]

          return (
            <motion.div
              key={columnIndex}
              className={`flex flex-col gap-5 ${columnIndex === 1 ? 'flex-col-reverse' : ''}`}
              animate={columnIndex === 1 ? scrollDownAnimation : scrollUpAnimation}
              initial={columnIndex === 1 ? { y: -singleSetHeight } : { y: 0 }}
            >
              {duplicatedImages.map((image, index) => (
                <Polaroid key={index} src={`/images/${image}`} />
              ))}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default Showcase

const Polaroid = ({ src }: { src: string }) => {
  const placeholderImage = 'https://placehold.co/190x240?text=Loading...'

  return (
    <div className='relative bg-slate-200 w-[190px] p-3 pb-10 shadow-[5px_5px_10px_0px_rgba(0,0,0,0.3)]'>
      <img
        src={src}
        alt='a polaroid picture'
        className='w-full'
        onError={e => {
          e.currentTarget.src = placeholderImage
        }}
      />
    </div>
  )
}
