import { Request, Response } from "express";
import bcrypt from "bcrypt";
import generator from "generate-password";
import mailSender from "../middlewares/email.middleware";
import { ResponseInterface } from "../interfaces/response.interface";
import { Provider, UserInterface, UserModel } from "../models/user.model";

class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserModel.getAll();
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

  async signup(req: Request, res: Response) {
    const errResponse: ResponseInterface<Error> = {
      result: false,
      message: "",
    };
    try {
      const { email, password, username } = req.body;
      if (!email || !password || !username) {
        errResponse.message =
          "Username, email and password fields are mandatory";
        return res.status(400).send(errResponse);
      }

      let emailExist = await UserModel.getByEmail(email);
      if (emailExist.result) {
        errResponse.message = "Account with this email already exists";
        return res.status(200).send(errResponse);
      }

      // hash password here
      const hashedPassword: string = await bcrypt.hash(password, 10);
      const user: UserInterface = {
        email,
        password: hashedPassword,
        username,
        provider: Provider.password,
        isVerified: false,
        socialId: "",
        profilePicture: "",
        bio:"Hey there! I am ATCian"
      };

      const newUser: any = await UserModel.create(user);
      return res.status(200).send({
        result: true,
        message: "Account created successfully",
        data: user,
      });
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

  async getUserByUserId(req: Request, res: Response) {
    const errResponse: ResponseInterface<Error> = {
      result: false,
      message: "",
    };
    try {
      const userId = parseInt(req.params.userId);
      if (!userId) {
        errResponse.message = "Invalid user id";
        return errResponse;
      }
      const userRes = await UserModel.getbyId(userId);
      if (userRes.result) {
        const succResponse: ResponseInterface<UserInterface> = {
          result: true,
          data: userRes.user,
        };
        return res.status(200).send(succResponse);
      } else {
        return res.status(404).send(userRes);
      }
    } catch (e) {
      console.log(e);
      errResponse.message = "Error occurred while getting user";
      return res.status(200).send(errResponse);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const updatedUser:any = {
        ...req.user,
        bio:req.body.bio,
        profilePicture:req.body.profilePicture,
        username:req.body.username
      }

      await UserModel.update(updatedUser);
      const succResponse: ResponseInterface<void> = {
        result: true,
        message: "User updated successfully",
      };
      return res.status(200).send(succResponse);
    } catch (e) {
      console.log("Error updatng user : ", e);
      const errResponse: ResponseInterface<Error> = {
        result: false,
        message: "Failed to update! Try later",
      };
      return res.status(200).send(errResponse);
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

  async sendValidUser(req: Request, res: Response) {
    res.status(200).send({ result: true, user: req.user });
  }

  async logOut(req:Request, res:Response){
    try{  
      req.logout((err) => {
        if (err) {
          return res.status(500).send({ result: false, message: "Logout failed" });
        }
        // Clear the cookies by setting them with an expired date
        res.cookie("accessToken", "", {
          httpOnly: true,
          secure: false,
          expires: new Date(0),
          maxAge:0,
          sameSite: "none"
        });
    
        res.cookie("refreshToken", "", {
          httpOnly: true,
          secure: false,
          expires: new Date(0),
          maxAge:0,
          sameSite: "none"
        });
    
        const resObj = {
          result: false,    //for validate user api, if user is not deleted, logout will be called
          message: "Logged out successfully"
        };
        return res.status(200).send(resObj);
      });
    } catch (e){
      console.log(e);
      return res.status(200).send({result:false, message:"Failed to log out! Please try again."})
      
    }

  }
}

export default UserController;
