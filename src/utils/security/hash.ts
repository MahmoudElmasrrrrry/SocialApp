
import bcrybt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrybt.hash(password, saltRounds);
  return hashedPassword;
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const isMatch = await bcrybt.compare(password, hashedPassword);
  return isMatch;
}

