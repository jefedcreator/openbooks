import React from 'react'
// import Profile from './components/Profile';

const Home = () => {
  return (
    <div className='h-full'>
        <div className='flex h-3/4 flex-row justify-around'>
            <div className='max-w-md flex flex-col justify-around'>    
              <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"><span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">The next</span> digital publishers.</h1>
              <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">distribute your books in form of NFTs and reach your fans directly</p>
            </div>
            <div className='h-full flex justify-center items-center p-5'>
              <img className='rotate-35 p-15' src="https://res.cloudinary.com/hemi/image/upload/v1669617160/openbooks/luisa-brimble-VfHoMBagDPc-unsplash_rxs3bv.jpg" alt="" />
            </div>
        </div>
    </div>
  )
}

export default Home