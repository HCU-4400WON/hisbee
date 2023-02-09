const titles = [
  "🔥 요즘 핫한 모집글",
  "👨‍🎨  신규 모집글",
  "📢  마감임박! 모집글",
  "👨‍👦‍👦  모집인원 임박! 모집글",
];

function Main() {
  return (
    <>
      <div className=" rounded-lg h-96 mx-5 mt-10 mx-10 bg-gradient-to-r from-gray-200 to-gray-500"></div>
      {titles.map((title) => (
        <div className="w-full mx-5">
          <div className="flex justify-between mx-20 mt-20 mb-10">
            <p className="text-xl font-bold">{title}</p>
            <svg
              className="w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
            </svg>
          </div>

          <div className="grid grid-cols-4 gap-10 mx-10">
            {[0, 0, 0, 0].map((e) => (
              <div
                className="h-80 rounded-md"
                style={{ boxShadow: "0px 0px 25px rgb(0 0 0 / 0.3)" }}
              >
                <div className="border-0 rounded-sm h-2/5 mx-5 mt-5 mb-3 bg-gradient-to-r from-white to-purple-200 to-purple-300"></div>
                <div className="flex items-center">
                  <p className="mx-5 text-sm font-bold">개발자</p>
                  <p className="text-sm text-blue-500">2명 모집</p>
                </div>
                <p className="mx-5 my-1 text-lg font-bold">앱 개발 팀원 모집</p>
                <p className="mx-5 my-3">
                  안녕하세요! 사이드 프로젝트 팀원을 구하고 있는...!!!
                </p>
                <span></span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="w-full mx-5"></div>
      <div className="w-full mx-5"></div>
      <div className="w-full mx-5"></div>
    </>
  );
}

export default Main;
