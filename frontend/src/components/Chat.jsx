import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { chatContract, getProposalsContract } from "../constants/contracts";
import { toast } from "react-toastify";
import { readOnlyProvider, getProvider } from "../constants/providers";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";

export default function Chat() {
  const [senderEnsName, setSenderEnsName] = useState("");
  const [receiverEnsName, setReceiverEnsName] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [{ data: messages }, setMessages] = useState({ data: [] });
  const [{ data: registeredUsers }, setRegisteredUsers] = useState({
    data: [],
  });
  const [selectedUser, setSelectorUser] = useState();
  const { walletProvider } = useWeb3ModalProvider();
  const { address } = useWeb3ModalAccount();

  console.log(messages);

  useEffect(() => {
    const contract = chatContract(readOnlyProvider);

    contract
      .getRegisteredUsers()
      .then((res) => {
        const converted = res.map((item) => ({
          ensName: item.ensName,
          DisplayPictureURI: item.DisplayPictureURI,
        }));

        setRegisteredUsers({
          data: converted,
        });
      })
      .catch((err) => {
        console.error("error fetching proposals: ", err);
      });
  }, []);

  const selectReceiver = (selectedUser) => {
    setReceiverEnsName(selectedUser);
    setSelectorUser(selectedUser);
  };

  const sendMessage = async () => {
    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();

    const contract = chatContract(signer);
    try {
      const tx = await contract.sendMessage(receiverEnsName, messageContent);
      const txReceipt = await tx.wait();
      console.log("Receipt: ", txReceipt);
      setMessageContent("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const chat = chatContract(readOnlyProvider);
    const nameService = getProposalsContract(readOnlyProvider);

    async () => {
      const senderName = await nameService.domains(address);
      setSenderEnsName(senderName[0]);

      const history = await chat
        .getMessages(senderEnsName, receiverEnsName)
        .then((res) => {
          const response = res.map((item) => ({
            sender: item.sender,
            receiver: item.receiver,
            content: item.content,
          }));

          setRegisteredUsers({
            data: response,
          });
        })
        .catch((err) => {
          console.error("error fetching proposals: ", err);
        });

      setMessages(history);
    };
  }, []);

  return (
    <div className="flex h-[85vh]">
      {/* Sidebar */}
      <div className="w-1/4 bg-[#201D29] p-4">
        <h2 className="text-xl font-semibold mb-4 text-white">Contacts</h2>
        <ul className="flex flex-col gap-3">
          {registeredUsers.map((user, index) => (
            <li
              key={index}
              onClick={() => selectReceiver(user.ensName)}
              className={`text-white flex items-center gap-4 cursor-pointer p-2 rounded-lg hover:bg-[#31306B] ${
                selectedUser === user.ensName ? "bg-[#31306B]" : ""
              }`}
            >
              <img
                src={`${import.meta.env.VITE_GATEWAY_URL}${
                  user.DisplayPictureURI
                }`}
                alt=""
                className="w-10 h-10 rounded-md"
              />
              {user.ensName}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Chat Header */}
        <div className="bg-whatsapp-light text-[white] py-3 px-4 flex items-center justify-between">
          <span className="text-lg font-semibold">
            {selectedUser ? selectedUser : "Select a contact"}
          </span>
          {/* <span>{senderEnsName}</span> */}
        </div>

        {/* Messages */}
        <div className="flex-1 bg-[#17141f] px-4 py-2 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 ${
                msg.sender === senderEnsName ? "self-end" : "self-start"
              }`}
            >
              <div
                className={`rounded-lg p-2 max-w-md ${
                  msg.sender === senderEnsName
                    ? "bg-whatsapp-green text-white"
                    : "bg-whatsapp-light"
                }`}
              >
                {msg.content}
              </div>
              <div
                className={`text-xs ${
                  msg.sender === senderEnsName ? "text-right" : ""
                }`}
              >
                {msg.sender}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-whatsapp-light flex items-center px-4 py-2 gap-1">
          <input
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type a message..."
            className="mt-1 bg-transparent border border-gray-700 px-3 py-3 shadow-sm focus:outline-none focus:bg-[#292631] hover:bg-[#292631] w-full rounded-full sm:text-sm placeholder:text-gray-500 text-gray-300"
          />
          <button
            onClick={sendMessage}
            disabled={!selectedUser || !messageContent}
            className={`bg-transparent border-none outline-none focus:outline-none focus:border-none ${
              !selectedUser || !messageContent
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <img src="./send.png" alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}
