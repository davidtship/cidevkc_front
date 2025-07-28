import { Suspense } from 'react';
import { PreloaderFull } from '@/components/Misc/Preloader';
const DefaultLayout = ({ children }) => {
    return <Suspense fallback={<PreloaderFull />}>{children}</Suspense>;
};
export default DefaultLayout;
