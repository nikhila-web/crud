import UserService from "../services/user.service.js";
import { getToken } from "../token/index.js";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";

export default class User {
  static async onboard(req, res) {
    try {
      const hash = await bcrypt.hash(req.body.password, 10);
      if (!hash) {
        return res.status(500).json({ message: "Error in Hashing" });
      }
      const createuser = {
        onboarded: true, 
        username: req.body.username,
        email: req.body.email,
        password: hash,
      };

      const user = await UserService.getUser({ email: req.body.email });
      if (user) {
        return res
          .status(409)
          .json({ error: `${createuser.email} Already exist`, success: false });
      }
      await UserService.create(createuser)
        .then((data) => {
              return res.status(200).json({
                message:
                  "user has been registered successfully",
                success: true,
                user: data,
              });
            })
        .catch((error) => {
          res.status(500).json({ error: "error in onboarding user" });
        });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async login(req, res) {
    try {
      const user = await UserService.getUser({
        username: req.body.username,
        email: req.body.email,
        onboard: true,
      });
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const token = getToken(user.id);
          const updateRequest = {
            token: token,
          };
          StudentService.update({ email: req.body.email }, updateRequest)
            .then((data) => {
              res.json({
                status: "success",
                message: "usser found!!",
                user: {
                  username: data.username,
                  email: data.email,
                  token: data.token,
                },
              });
            })
            .catch((error) => {
              res.status(500).json({ error: "error in updating user" });
            });
        } else {
          res.json({
            status: "error",
            message: "Invalid password!!!",
            data: null,
          });
        }
      } else {
        res.json({ status: "error", message: "user not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async gerAll(req, res, next) {
    try {
      const findUser = await UserService.getAll();
      if (findUser) {
          res.json({
            status: "success",
            message: "users found!!!",
            data: { users: findUser },
          });
      } else {
        res.json({ status: "error", message: "users not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async currentUser(req, res, next) {
    try {
      const query = {
        _id: req.userId,
      };
      const user = await UserService.getUser(query);
      if (user) {
        res.json({
          status: "success",
          message: "user found!!!",
          user: {
            username: user.username,
            email: user.email,
          },
        });
      } else {
        res.json({ status: "error", message: "user not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
  static async updateProfile(req, res) {
    try {
      const user = await UserService.getUser({ _id: req.params.id });
      if (user) {
        const updateUser = {
          username: req.body.username,
        };
        UserService.update({ _id: req.params.id }, updateUser)
          .then((data) => {
            res.json({
              status: "success",
              message: "user updated",
              data,
            });
          })
          .catch((error) => {
            res.status(500).json({ error: "error in updating user" });
          });
      } else {
        res.json({ status: "error", message: "user not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }


  static async resetPass(req, res, next) {
    try {
      const user = await UserService.getUser({ email: req.body.email });
      if (user) {
        const new_password = req.body.new_password;
        const changed_password = await bcrypt.hash(new_password, 10);
        UserService.update(
          { email: req.body.email },
          { password: changed_password }
        )
          .then((data) => {
            res.json({
              status: "success",
              message: "password changed sucessfully",
              data,
            });
          })
          .catch((error) => {
            res.status(500).json({ error: "error in updating user" });
          });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
  
  static async deleteUser(req, res, next) {
    try {
      const findUser = await UserService.getUser({ _id: req.params.id });
      if (findUser) {
        UserService.delete({ _id: req.params.id }, findUser)
          .then((data) => {
            res.json({
              status: "success",
              message: "user deleted",
              data,
            });
          })
          .catch((error) => {
            res.status(500).json({ error: "error in updating user" });
          });
      } else {
        res.json({ status: "error", message: "user not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}
