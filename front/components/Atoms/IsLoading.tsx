const IsLoading = () => {
  return (
    <div
      className={
        'w-2/3 h-full absolute top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4 backdrop-blur-md bg-white/30 rounded-xl z-10 max-md:w-full'
      }
    >
      <p
        className={
          'text-xl absolute top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4'
        }
      >
        Now Loading...
      </p>
    </div>
  );
};

export default IsLoading;
