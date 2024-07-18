'use client'
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import dynamic from 'next/dynamic';


// Dynamic Import menghindari server side rendering
const ATSTemplate = dynamic(() => import('../../components/Preview/ATSTemplate'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});


const Page: React.FC = () => {
  const cv = useSelector((state: RootState) => state.cv);

  return (
      <ATSTemplate cv={cv} />
  );
};

export default Page;
