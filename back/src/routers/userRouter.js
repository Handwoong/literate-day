import is from "@sindresorhus/is";
import { Router } from "express";
// import { login_required } from "../middlewares/login_required";
import { userAuthService } from "../services/userService";
import config from "../config";

const userAuthRouter = Router();

// POST /user/register : user 추가
userAuthRouter.post("/user/register", async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error("잘못된 요청입니다.");
    }

    // req (request) 에서 데이터 가져오기
    const email = req.body.email;
    const password = req.body.password;
    const nickname = req.body.nickname;

    // 위 데이터를 유저 db에 추가하기
    const newUser = await userAuthService.addUser({
      email,
      password,
      nickname,
    });

    if (newUser.errorMessage) {
      throw new Error(newUser.errorMessage);
    }

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// POST /user/login : user 로그인
userAuthRouter.post("/user/login", async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await userAuthService.getUser({ email, password });

    if (user.errorMessage) {
      throw new Error(user.errorMessage);
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// GET /oauth/kakao : kakaoUser 로그인
userAuthRouter.get("/oauth/kakao", (req, res, next) => {
  const code = req.query.code;

  try {
    axios
      .post( // 토큰 발급
        `${config.kakao.oauthUrl}?grant_type=${config.kakao.grantType}&client_id=${config.kakao.clientId}&redirect_uri=${config.kakao.redirectUrl}&code=${code}`,
        {
          headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      )
      .then((result) => {
        const accessToken = result.data.access_token;

        axios.post(`https://kapi.kakao.com/v2/user/me`, { // 토큰으로 유저(나) 정보 얻기
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((result) => {
          const kakaoAccount = result.data.kakao_account;
          const nickname = kakaoAccount.profile.nickname;
          const email = kakaoAccount.email;

          const user = await userAuthService.getKakaoUser({ email });

          if(user.errorNotFound) {
            const newUser = await userAuthService.addKakaoUser({
              nickname,
              email,
            });

            res.status(200).json(newUser);
          } else {
            res.status(200).json(user);
          }

        })
        .catch((error) => {
          next(error);
        })
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
});

// GET /users : 전체 user 조회
userAuthRouter.get("/users", async (req, res, next) => {
  try {
    const users = await userAuthService.getUsers();
    const kakaoUsers = await userAuthService.getKakaoUsers();

    const totalUsers = { 
      "general" : users,
      "kakao" : kakaoUsers,
    }

    res.status(200).json(totalUsers);
  } catch (error) {
    next(error);
  }
});

// GET /user/current : 현재 로그인 user 조회
userAuthRouter.get(
  "/user/current",
  login_required,
  async (req, res, next) => {
    try {
      const userType = req.currentUserType;
      const userId = req.currentUserId;
      
      let currentUserInfo = null;
      if(userType === 'general'){ // 일반 로그인 유저
        currentUserInfo = await userAuthService.getUserInfo({
          userId,
        });
      } else if(userType === 'kakao'){ // 카카오 로그인 유저
        currentUserInfo = await userAuthService.getKakaoUserInfo({
          userId,
        });
      }

      if (currentUserInfo?.errorMessage) {
        throw new Error(currentUserInfo.errorMessage);
      } else if(currentUserInfo === null) {
        throw new Error("userType이 잘못되었습니다.")
      }

      res.status(200).json(currentUserInfo);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /user/:userId : user 정보 수정
userAuthRouter.put(
  "/user/:userId",
  login_required,
  async (req, res, next) => {
    try {

      const userType = req.currentUserType;
      const { userId } = req.params;
      const { nickname, password } = req.body;

      let updatedUser = null;
      if(userType === 'general'){
        const toUpdate = {
          nickname,
          password,
        };
        updatedUser = await userAuthService.setUser({ userId, toUpdate });

      } else if(userType === 'kakao'){
        const toUpdate = {
          nickname,
        }
        updatedUser = await userAuthService.setKakaoUser({ userId, toUpdate });

      }

      if (currentUserInfo?.errorMessage) {
        throw new Error(currentUserInfo.errorMessage);
      } else if(currentUserInfo === null) {
        throw new Error("userType이 잘못되었습니다.")
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

// GET /users/:userId : 일반 user 조회
userAuthRouter.get(
  "/users/:userId",
  //login_required,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const user = await userAuthService.getUserInfo({ userId });

      if (user.errorMessage) {
        throw new Error(user.errorMessage);
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

// GET /users/kakao/:userId : 카카오 user 조회
userAuthRouter.get(
  "/users/kakao/:userId",
  //login_required,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const user = await userAuthService.getKakaoUserInfo({ userId });

      if (user.errorMessage) {
        throw new Error(user.errorMessage);
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);


// DELETE /user/:userId : user 삭제 (회원 탈퇴)
userAuthRouter.delete(
  "/user/:userId",
  login_required,
  async (req, res, next) => {
    try {
      const { userId } = req.params;

      const deletedUser = await userAuthService.deleteUser({ userId });
    
      if (deletedUser.deletedCount !== 1) {
        throw new Error("정상적으로 삭제되지 않았습니다.");
      }

      res.status(200).send("success");
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /user/kakao/:userId : kakao user 삭제 (단순히 우리 db에서 삭제)
userAuthRouter.delete(
  "/user/kakao/:userId",
  //login_required,
  async (req, res, next) => {
    try {
      const { userId } = req.params;

      const deletedUser = await userAuthService.deleteKakaoUser({ userId });
    
      if (deletedUser.deletedCount !== 1) {
        throw new Error("정상적으로 삭제되지 않았습니다.");
      }

      res.status(200).send("success");
    } catch (error) {
      next(error);
    }
  }
);


export { userAuthRouter };
