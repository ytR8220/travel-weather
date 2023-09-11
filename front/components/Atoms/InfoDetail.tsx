const InfoDetail: React.FC<detail> = ({ color, title, content }) => {
  return (
    <p
      className={`${color} max-md:flex max-md:flex-col max-md:items-center max-md:text-sm`}
    >
      {title}
      <span className={'ml-5 max-md:ml-0 max-md:text-base'}>{content}</span>
    </p>
  );
};

export default InfoDetail;
