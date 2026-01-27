'use client'

import dynamic from 'next/dynamic'
import { Spinner } from '@/components/ui/spinner'

const CustomDesignerPro = dynamic(() => import('./custom-designer-pro'), {
    ssr: false,
    loading: () => (
        <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-4 text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p>Loading Designer...</p>
        </div>
    )
})

export default function DesignerWrapper() {
    return <CustomDesignerPro />
}
