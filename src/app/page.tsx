import Image from "next/image";
import HomeButton from '@/components/home_button'
import jasLogo from '../asset/jas - white.png';
import Profile from '@/components/Profile';

export default function Home() {
  return (
    <div>
      <div className="flex flex-center pl-3 pt-3 text-white items-center justify-between">
        <Image src={jasLogo} width={120} height={120} alt="jas logo white"/>
        <Profile />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold text-white">Welcome to <b className="uppercase">AviaSec</b></h1>
          </div>
          <p className="max-w-xl mt-1 text-lg text-white">
            Flight Schedule Management System
          </p>
          <div className="flex flex-row items-center text-center">
            <div className="flex mt-2">
              <HomeButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
