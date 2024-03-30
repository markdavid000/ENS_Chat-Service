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
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-xl font-semibold mb-4">Contacts</h2>
        <ul>
          {registeredUsers.map((user, index) => (
            <li
              key={index}
              onClick={() => selectReceiver(user)}
              className={`cursor-pointer p-2 rounded-lg hover:bg-gray-300 ${
                selectedUser === user ? "bg-gray-300" : ""
              }`}
            >
              {user}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Chat Header */}
        <div className="bg-whatsapp-light text-white py-3 px-4 flex items-center justify-between">
          <span className="text-lg font-semibold">
            {selectedUser ? selectedUser : "Select a contact"}
          </span>
          <span>{senderEnsName}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-gray-100 px-4 py-2 overflow-y-scroll">
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
        <div className="bg-whatsapp-light flex items-center px-4 py-2">
          <input
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 mr-2 bg-white focus:outline-none border rounded-full px-4 py-2"
          />
          <button
            onClick={sendMessage}
            disabled={!selectedUser || !messageContent}
            className={`bg-whatsapp-green hover:bg-whatsapp-dark text-white font-bold py-2 px-4 rounded-full ${
              !selectedUser || !messageContent
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
