import Heading from '@/src/components/Heading'
import { splitTitle } from '@/src/lib/utils'
import Image from 'next/image'
import React from 'react'

const Hero = ({text}:{text:string}) => {
    const title=splitTitle(text)
  return (
           <section className="grid md:grid-cols-2 gap-10 items-center">
          <div className='pl-28'>
            <Heading first={title.firstHalf} second={title.secondHalf} size="lg" />
            <p className="mt-6 text-lg">
              Empowering digital authenticity through secure blockchain technology.
              We are building the infrastructure for a world where every contribution
              is verifiable and every impact is measurable.
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