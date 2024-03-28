import { ethers } from "ethers";
import ens from "./abi/ensNameService.json";

export const getProposalsContract = (providerOrSigner) =>
    new ethers.Contract(
        import.meta.env.VITE_ens_contract_address,
        ens,
        providerOrSigner
    );
