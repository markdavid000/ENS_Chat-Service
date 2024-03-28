import React, { useState } from "react";
import useRegName from "../hooks/useRegName";

const RegisterENS = () => {
  const [ensName, setEnsName] = useState("");
  const [userName, setUserName] = useState("");
  const [displayPicture, setDisplayPicture] = useState(""); // For storing the file object
  const [result, setResult] = useState("");
  const [image, setImage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDisplayPicture(file);
  };

  const uploadDisplayPicture = async () => {
    if (!displayPicture) {
      return "";
    }

    try {
      const formData = new FormData();
      formData.append("file", displayPicture);
      const metadata = JSON.stringify({
        name: "File name",
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );
      const resData = await res.json();
      setImage(`${import.meta.env.VITE_GATEWAY_URL}${resData.IpfsHash}`);
      console.log(resData);
    } catch (error) {
      console.log(error);
    }
  };

  const displayPictureURI = uploadDisplayPicture();

  const handleReg = useRegName(ensName, userName, displayPictureURI);

  const handleRegister = async () => {
    try {
      handleReg;
      setResult(`Registered ${ensName}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <div>
        <img
          className="w-20 h-20 rounded-full"
          src={image}
          alt="Rounded avatar"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="ENS Name"
          value={ensName}
          onChange={(e) => setEnsName(e.target.value)}
        />
        <input
          type="text"
          placeholder="User Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleRegister}>Register</button>
        {/* <button onClick={handleUpdateDP}>Update Display Picture</button>
        <button onClick={handleUpdateUserName}>Update User Name</button>
        <button onClick={handleGetDetails}>Get Details</button> */}
      </div>
      <div>
        <h2>Result:</h2>
        <pre>{result}</pre>
      </div>
    </>
  );
};

export default RegisterENS;
