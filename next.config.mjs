/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/robots.txt',
                destination: '/api/robots'
            }
        ];
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
        // OU version sélective :
        // removeConsole: {
        //     exclude: ['error'],
        // },
    }
};

export default nextConfig;