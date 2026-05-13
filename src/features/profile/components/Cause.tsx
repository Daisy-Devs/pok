import { GraduationCap } from 'lucide-react'
import React from 'react'

interface CauseProps {
    cause:string,
    organization:string
}
const Cause: React.FC<CauseProps> = ({cause,organization}) => {
  return (
    <div className='flex flex-row gap-3'>
        <div className='flex justify-center items-center rounded-xl aspect-square h-10 bg-[#FFEDD5]'>
            <GraduationCap className='text-[#EA580C] w-5 h-5' />
        </div>
        <div className='flex flex-col gap-1'>
            <p className='text-base font-semibold text-secondarText'>{cause}</p>
            <p className='text-xs'>{organization}</p>
        </div>
    </div>
  )
}

export default Cause