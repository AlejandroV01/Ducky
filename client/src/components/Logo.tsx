import Image from 'next/image'
import React from 'react'

interface LogoProps {
  size?: number
}

const Logo: React.FC<LogoProps> = ({ size }) => {
  return (
    <div className={size ? '' : 'w-full'}>
      <Image src='/images/LOGOduck.svg' alt='Logo' width={size || 100} height={size || 100} />
    </div>
  )
}

export default Logo
