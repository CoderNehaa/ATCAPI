import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generator from "generate-password";
import mailSender from "../middlewares/email.middleware";
import { ResponseInterface } from "../interfaces/response.interface";
import { Provider, UserInterface, UserModel } from "../models/user.model";

class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = ["pending"];
      const succResponse: ResponseInterface<typeof users> = {
        result: true,
        message: "Data fetched successfully",
        data: users,
      };
      return res.status(200).send(succResponse);
    } catch (e) {
      console.log(e);
      const errResponse: ResponseInterface<Error> = {
        result: true,
        message: "Error occurred while fetching users list",
      };
      return res.status(500).send(errResponse);
    }
  }

  async addNewUser(req: Request, res: Response) {
    try {
      const {email, password, username} = req.body;
      if(!email || !password || !username){
        const errResponse:ResponseInterface<Error> = {
          result:false,
          message:"Username, email and password fields are mandatory"
        }
        return res.status(400).send(errResponse);
      }

      let emailExist = await UserModel.getByEmail(email);
      if (emailExist.result) {
        const errResponse: ResponseInterface<Error> = {
          result: false,
          message: "Account with this email already exists",
        };
        return res.status(409).send(errResponse);
      }

      // hash password here
      const hashedPassword:string = await bcrypt.hash(password, 10);
      const user:UserInterface = {
        email, password:hashedPassword, username, provider:Provider.password, isVerified:false, socialId:"", profilePicture:""
      }
      const newUser:any = await UserModel.create(user);
      const succResponse: ResponseInterface<void> = {
        result: true,
        message: "User created successfully",
        data:newUser
      };
      
      return res.status(201).send(succResponse);
    } catch (e) {
      console.log(e);
      const errResponse: ResponseInterface<Error> = {
        result: false,
        message: "Error occurred while creating user",
      };
      return res.status(500).send(errResponse);
    }
  }

  async deleteUser(req: Request, res: Response) {
    debugger;
    try {
      const userId = parseInt(req.params.userId);
      const userExist = await UserModel.getbyId(userId);
      if (!userExist.result) {
        const errResponse: ResponseInterface<Error> = {
          result: false,
          message: "User not found",
        };
        return res.status(404).send(errResponse);
      }

      //delete from db
      await UserModel.delete(userId);
      const succResponse: ResponseInterface<void> = {
        result: true,
        message: "User account deleted successfully",
      };
      return res.status(200).send(succResponse);
    } catch (e) {
      console.log(e);
      const errResponse: ResponseInterface<Error> = {
        result: false,
        message: "Error occurred while deleting user",
      };
      return res.status(500).send(errResponse);
    }
  }

  async signin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = { userId: "pending", email: "pending", password: "pending" };
      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
          const token = jwt.sign(
            { userId: user.userId, email: user.email },
            "WG6oqviIhVwcCJKY1ZI5G0NKnaTB5uYb",
            { expiresIn: "1h" }
          );
          const succResponse: ResponseInterface<any> = {
            result: true,
            message: "Signed in successfully",
            data: {
              user,
              token,
            },
          };
          return res.status(200).send(succResponse);
        }
        const errResponse: ResponseInterface<Error> = {
          result: false,
          message: "Incorrect password",
        };
        return res.status(401).send(errResponse);
      }
      const errResponse: ResponseInterface<Error> = {
        result: false,
        message: "User not found",
      };
      return res.status(404).send(errResponse);
    } catch (e) {
      console.log(e);
      const errResponse: ResponseInterface<Error> = {
        result: false,
        message: "Error occurred while validating user",
      };
      return res.status(500).send(errResponse);
    }
  }

  async getUserByUserId(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const userFound = await UserModel.getbyId(userId);
      if (userFound.result) {
        const succResponse: ResponseInterface<typeof userFound.user> = {
          result: true,
          data: userFound.user,
        };
        return res.status(200).send(succResponse);
      } else {
        return res.status(404).send(userFound);
      }
    } catch (e) {
      console.log(e);
      const errResponse: ResponseInterface<Error> = {
        result: false,
        message: "Error occurred while getting user",
      };
      return res.status(500).send(errResponse);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const updatedUser = req.body;
      const { userId } = req.params;

      const succResponse: ResponseInterface<void> = {
        result: true,
        message: "User updated successfully",
      };
      return res.status(200).send(succResponse);
    } catch (e) {
      console.log("Error updatng user : ", e);
      const errResponse: ResponseInterface<Error> = {
        result: true,
        message: "Error occurred while updating user",
      };
      return res.status(500).send(errResponse);
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = { data: "pedning" };

      if (!user) {
        const errResponse: ResponseInterface<Error> = {
          result: false,
          message: "User not found",
        };
        return res.status(404).send(errResponse);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      //update password in db here
      const succResponse: ResponseInterface<void> = {
        result: true,
        message: "Password changed successfully",
      };
      return res.status(200).send(succResponse);
    } catch (e) {
      console.log(e);
      const errResponse: ResponseInterface<Error> = {
        result: false,
        message: "Error occurred while changing password",
      };
      return res.status(500).send(errResponse);
    }
  }

  async sendVerificationLink(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const userExist = { data: "pending" };
      if (userExist) {
        const randomPassword = generator.generate({
          length: 10,
          uppercase: false,
        });
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        //update password in db here
        const mailSent = await mailSender(email, "Pending", randomPassword);
        if (mailSent) {
          const succResponse: ResponseInterface<void> = {
            result: true,
            message:
              "Temporary password sent on this email address. Login again",
          };
          return res.status(200).send(succResponse);
        }
      } else {
        const errResponse: ResponseInterface<Error> = {
          result: true,
          message: "No account found associated with this email",
        };
        return res.status(404).send(errResponse);
      }
    } catch (e) {
      console.log(e);
      const errResponse: ResponseInterface<Error> = {
        result: true,
        message: "Interal server error",
      };
      return res.status(500).send(errResponse);
    }
  }
}

export default UserController;
