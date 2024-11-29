import { X } from "lucide-react";

type ThumpUserCloseProps = {
  img: string|undefined;
  name: string;
  haveClose: boolean;
  onClose: () => void;
};

type ThumpUser = {
     img?: string;
     name: string;
     haveClose?: boolean;
     onClose?: () => void;
}

type ThumpUserHolderProps = {
  img?: string;
  name: string;
  dark?: boolean;

} & (ThumpUserCloseProps | ThumpUser);

export default function ThumpUserHolder({
  img,
  name,
  haveClose,
  onClose,
  dark,
}: ThumpUserHolderProps) {
  console.log(dark);
  return (
    <div className={`rounded-[30px] h-[50px] font-bold   w-[fit-content] py-1 px-3 mx-2 flex flex-row items-center gap-3 ${
      dark ? "bg-hoverColor " : "bg-white"
    }`} >
      {
        img &&
        <img
          src={img}
          alt="user"
          className="h-10 w-10 rounded-full object-cover"
        />
      }
      <p className={`text-sm ${dark ? 'text-white':'text-black'}`}>{name}</p>
      {haveClose && (
        <button
          type="button"
          className="text-black"
          onClick={(e) => {
            e.stopPropagation();
            if (haveClose && onClose) {
              onClose();
            }
          }}
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
