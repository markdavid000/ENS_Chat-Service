import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="flex items-center justify-between bg-[#31306B] p-4 pb-4">
      <div className="flex items-center gap-10">
        <Link to={"/"}>
          <div className="font-mono font-extrabold text-2xl text-white">
            <span className="text-[#6D6FF3]">ENS</span>Chat
          </div>
        </Link>
        <Link to={"/chat"}>
          <p className="font-mono text-white">Chat</p>
        </Link>
      </div>
      <w3m-button />
    </div>
  );
}
