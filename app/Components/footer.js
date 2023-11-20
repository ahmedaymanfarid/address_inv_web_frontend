"use client"
import { useState } from 'react'
import Image from 'next/image';



export default function Footer() {
    const [open, setOpen] = useState(false)
    return (
<footer className="relative flex flex-col items-center overflow-hidden bg-black dark:bg-black py-20 ">
<div className="container relative z-[1] m-auto px-6 md:px-12">
 
    <div className="flex flex-wrap items-center justify-between md:flex-nowrap">
    <div className=" " >
            <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert mr-40"
          src="/login_cover.png"
          alt="Next.js Logo"
          width="200"
          height="50"
          priority
        />
            </div>
      <div
        className="flex w-full justify-center space-x-12 text-white dark:text-white sm:w-7/12 md:justify-start ml-60"
      >
        <ul className="list-inside list-disc space-y-8">
          <li><a href="#" className="transition hover:text-primary">Home</a></li>

          <li><a href="#" className="transition hover:text-primary">About</a></li>
          <li><a href="#" className="transition hover:text-primary">Contact</a></li>
          <li><a href="#" className="transition hover:text-primary">Terms of Use</a></li>
        </ul>

        
      </div>
      <div
        className="m-auto mt-16 w-10/12 space-y-6 text-center sm:mt-auto sm:w-5/12 sm:text-left"
      >
        <span className="block text-white dark:text-white"
          >We change the way UI components librairies are used</span
        >

        <span className="block text-white dark:text-white">Tailus Blocks &copy; <span id="year"></span></span>

        <div className="text-white">
          <a href="#" className="font-semibold">Terms of Use </a>
          <a href="#" className="font-semibold"> Privacy Policy</a>
        </div>

        <span className="block text-white dark:text-white"
          >Need help? <a href="#" className="font-semibold text-white"> Contact Us</a></span
        >
      </div>
    </div>
</div>
</footer>)}