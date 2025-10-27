import { customAlphabet } from "nanoid";

const createOTP = () => {
  const nanoid = customAlphabet("1234567890", 6);
  return nanoid();
};

export default createOTP;
