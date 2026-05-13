import Heading from '@/src/components/Heading'
import { nomenclature } from '@/src/constants/nomenclature'
import { splitTitle } from '@/src/lib/utils'
import Image from 'next/image'
import React from 'react'

const Hero = ({text}:{text:string}) => {
    const title=splitTitle(text)
  return (
           <section className="grid md:grid-cols-2 gap-10 md:items-center">
          <div className='pl-9 md:pl-6'>
            <Heading first={title.firstHalf} second={title.secondHalf} size="lg" />
            <p className="mt-6 text-lg">
              {nomenclature.ABOUT_DESCRIPTION}
            </p>
          </div>

          <div className="flex justify-center">
            <div className="bg-primary-light rounded-2xl p-1 shadow-lg rotate-6">
              <Image
                src="/about-hero.png"
                alt="visual"
                width={320}
                height={320}
                className="rounded-xl -rotate-3 h-90.5 w-90.5 object-cover"
              />
            </div>
          </div>
        </section>
  )
}

export default Hero