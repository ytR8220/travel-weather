'use client';

import GetWeatherForm from '../Molecules/GetWeatherForm';
import SiteTitle from '../Atoms/SiteTitle';
import MainContent from '../Templates/MainContent';

const ViewPage = () => {
  return (
    <>
      <SiteTitle />
      <GetWeatherForm />
      <MainContent />
    </>
  );
};

export default ViewPage;
