import { useCallback } from "react";
import { isSupportedChain } from "../utils";
import { getProvider } from "../constants/providers";
import { getProposalsContract } from "../constants/contracts";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";

const useRegName = (ensName, userName, displayPictureURI) => {
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  return useCallback(async () => {
    if (!isSupportedChain(chainId)) return console.log("Wrong network");
    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();

    const contract = getProposalsContract(signer);

    try {
      const transaction = await contract.registerNameService(
        ensName,
        userName,
        displayPictureURI
      );
      console.log("transaction: ", transaction);

      const receipt = await transaction.wait();
      console.log("receipt: ", receipt);

      if (receipt.status) {
        return console.log("ENS Registered!");
      }

      toast.error("Registration failed!");
    } catch (error) {
      console.error("error: ", error);
    }
  }, [ensName, userName, displayPictureURI, chainId, walletProvider]);
};

export default useRegName;
