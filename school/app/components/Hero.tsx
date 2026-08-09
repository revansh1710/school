"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowUpRight,
  GraduationCap,
  BookOpen,
  Users,
} from "lucide-react"


export default function HeroCanvas() {
  return (
    <section
      className="
      relative 
      overflow-hidden
      bg-[#FAF7F0]
      px-5
      sm:px-8
      lg:px-20
      py-16
      lg:py-24
      "
    >
      <div
        className="
        absolute
        -top-32
        -right-32
        h-80
        w-80
        rounded-full
        bg-orange-200/50
        blur-3xl
        "
      />
      <div
        className="
        relative
        mx-auto
        max-w-7xl
        grid
        lg:grid-cols-2
        gap-14
        items-center
        "
      >
        <div>
          <h1
            className="
            mt-6
            max-w-3xl
            text-5xl
            sm:text-6xl
            lg:text-7xl
            font-bold
            tracking-tight
            leading-[0.95]
            text-slate-900
            "
          >

            Where curiosity
            becomes

            <span
              className="
              block
              italic
              font-light
              text-orange-600
              "
            >
              capability.
            </span>


          </h1>
          <p
            className="
            mt-6
            max-w-xl
            text-base
            sm:text-lg
            leading-relaxed
            text-slate-600
            "
          >

            A learning environment where students explore,
            create and grow through academics, creativity,
            technology and values.

          </p>
          <div
            className="
            mt-8
            flex
            flex-col
            sm:flex-row
            gap-3
            "
          >
          </div>
          <div
            className="
            mt-12
            grid
            grid-cols-3
            gap-4
            max-w-md
            "
          >
          </div>
        </div>
        {/* IMAGE AREA */}

        <div
          className="
          relative
          "
        >


          <div
            className="
            overflow-hidden
            rounded-[2.5rem]
            shadow-2xl
            "
          >

            <Image

              src="/images/hero_final.png"
              alt="Students"

              width={700}
              height={800}

              priority

              className="
              h-95
              sm:h-130
              w-full
              object-cover
              "

            />
          </div>
        </div>
      </div>
    </section>
  )
}




function Stat({
  icon,
  number,
  label
}: {
  icon: React.ReactNode,
  number: string,
  label: string
}) {


  return (

    <div
      className="
bg-white
rounded-2xl
p-4
shadow-sm
"
    >

      <div className="h-5 w-5 text-orange-600">

        {icon}

      </div>


      <p
        className="
mt-3
font-bold
text-lg
"
      >
        {number}
      </p>


      <p
        className="
text-xs
text-slate-500
"
      >
        {label}
      </p>


    </div>

  )

}