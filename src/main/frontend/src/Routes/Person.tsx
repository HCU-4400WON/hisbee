import tw from "tailwind-styled-components";

const Item = tw.div`

h-[100px] 
 border
`;

function Person() {
  return (
    <div className="flex border  w-screen h-screen">
      <div className="w-[295px] h-[300px] border">sidebar</div>
      <div className="h-screen w-full border-black mx-[60px] border flex flex-col">
        <div className="h-[240px] my-[40px] border">Banner</div>
        <div className="grid grid-cols-4 gap-4 w-full justify-between">
          <Item />
          <Item />
          <Item />
          <Item />
        </div>
      </div>
    </div>
  );
}

export default Person;
