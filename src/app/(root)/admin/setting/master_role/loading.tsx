import {Loader2} from 'lucide-react'

export default function Loading(){
    return (
        <div>
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                <div className='flex flex-col items-center text-center'>
                    <Loader2 className='h-10 w-10 text-blue-600 animate-spin' />
                </div>
            </div>
        </div>
    )
}