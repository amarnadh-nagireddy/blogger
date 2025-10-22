import { NextRequest } from "next/server";
import  jwt  from "jsonwebtoken";
interface JwtPayload {
  id: string;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

export const getDataFromToken=(request: NextRequest)=>{
    try {
        const token=request.cookies.get('token')?.value || '';
        const decodedToken=jwt.verify(token,process.env.TOKEN_SECRET!) as JwtPayload;
        console.log(decodedToken.id)
        return decodedToken.id;

    }
    catch (err: unknown) {
      console.error(err);

      let message = "Unknown error";

      if (err instanceof Error) {
        message = err.message;
      }

     throw new Error(message);
    }
}