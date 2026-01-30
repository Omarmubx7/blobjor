import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'BLOBJOR - Print on Demand',
        short_name: 'BLOBJOR',
        description: 'Custom hoodies, t-shirts, and mugs in Jordan. Design your own.',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
            {
                src: '/Bloblogo.png', // Assuming this exists based on usage in other files
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/Bloblogo.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
