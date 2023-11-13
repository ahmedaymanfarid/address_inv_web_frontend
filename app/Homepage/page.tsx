import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24" style={{backgroundColor:'white'}}>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
       <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/real_state_image_1.jpg"
          alt="Next.js Logo"
          width="0"
          height="0"
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
          priority
        />
      </div>
    </main>
  )
}
