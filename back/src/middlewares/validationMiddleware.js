import { body, validationResult } from "express-validator";

const isValidData = (type) => {
  switch (type) {
    case "register":
      return [
        body("email", "이메일 정보가 올바르지 않습니다.").exists().isEmail(),
        body("password", "비밀번호 정보가 올바르지 않습니다.").exists().isString()
        .isLength({ min: 3 }),
        body("nickname", "닉네임 정보가 올바르지 않습니다.")
          .exists().isString(),
      ];
    case "login":
      return [
        body("email", "이메일 정보가 올바르지 않습니다.").exists().isEmail(),
        body("password", "비밀번호 정보가 올바르지 않습니다.").exists().isString()
        .isLength({ min: 3 }),
      ];
    
    case "post":
      return [
        body("title", "제목 정보가 올바르지 않습니다.").exists().isString(),
        body("content", "내용 정보가 올바르지 않습니다.").exists().isString(),
        body("tags", "태그 정보가 올바르지 않습니다.").exists(),
        body("userId", "유저 정보가 올바르지 않습니다.").exists().isMongoId(),
        body("subjectId", "주제 정보가 올바르지 않습니다.").exists().isMongoId(),
        body("category", "카테고리 정보가 올바르지 않습니다.").exists().isIn(['소설', '시', '산문']),
      ];
  }
};

const invalidCallback = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.errors.reduce((acc, cur) => { 
      if (!(cur.param in acc)) acc[cur.param] = cur.msg;
      return acc;
    }, {});
    return res.status(400).json({ errors });
  }

  next();
};

export { isValidData, invalidCallback };
