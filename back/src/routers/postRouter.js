import { Router } from "express";
import { loginRequired } from "../middlewares/loginRequired";
import { isValidData, invalidCallback } from "../middlewares/validationMiddleware";
import { uploader, deleteImg } from "../middlewares/imageUploadMiddleware";
import { postService } from "../services/postService";
import { userAuthService } from "../services/userService";
import { typeName } from "../utils/validation/typeName";

const postRouter = Router();

// create
// 전 : /post
// 후 : /posts
postRouter.post('/posts', 
  loginRequired, 
  isValidData("post"),
  invalidCallback,
  async (req, res, next) => {
    try {
      const { title, content, tags, subjectId, category } = req.body;
      
      const userId = req.currentUserId;
      const user = await userAuthService.getUserInfo({ userId });
      const author = user.nickname;
      
      const newPost = await postService.addPost({
        author,
        title,
        content,
        tags,
        userId,
        subjectId,
        category,
      });
      if (newPost.errorMessage) {
        throw new Error(newPost.errorMessage);
      }

      res.status(201).json({ message: 'success', newPost});
    } catch (err) {
      next(err);
    }
});

// read
// 1. postId 로 해당 post 조회
postRouter.get('/posts/:postId', async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await postService.getPost({ postId });
    if (post.errorMessage) {
      throw new Error(post.errorMessage);
    }

    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

// 2. userId 로 해당 유저의 posts 조회
// 전 : /posts/users/:userId?page={Number}&limit={Number}
// 후 : /users/:userId/posts?sort[field]={String}&sort[type]={String}&page={Number}&limit={Number}
postRouter.get(
  "/users/:userId/posts",
  isValidData("post-sorting"),
  invalidCallback,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { sort, page, limit } = req.query;

      const posts = await postService.getPostsByUserId({
        sort,
        page,
        limit,
        userId,
      });
      res.status(200).json(posts);
    } catch (err) {
      next(err);
    }
  }
);



// 3. 태그 별 조회 
// 전 : /posts/tags?tag={String}&tag={String}&tag= ...  &page={Number}&limit={Number}
// 후 : /posts?tag={String}&tag={String}&tag= ...  &page={Number}&limit={Number}
// postRouter.get('/posts', async (req, res, next) => {
//   try {
//     const { tag, page, limit } = req.query;
    
//     let tags;
//     //tag에 값이 존재
//     if(tag !== undefined){
//       if (typeName(tag) === "Array") {
//         tags = tag;
//       } else {
//         tags = [tag];
//       }
//     } // tag에 값 없음
//     else {
//       const errorMessage = "올바른 URL query로 보내주세요! tag에 값이 없습니다.";
//       throw new Error(errorMessage);
//     }
    
    
//     // parameters ex) page: 2, limit: 10, tags: ['elice', encodeURI('봄')]  
//     // ※ 예시에서 encodeURI('봄') 으로 표현한 이유는 "유니코드인 한글"은 "URL 인코딩"되기 때문이다 
//     const posts = await postService.getTaggedPosts(page, limit, tags); 

//     res.status(200).json(posts);
//   } catch (err) {
//     next(err);
//   }
// });

// 4. 내용 검색(내용에는 태그, 제목, 컨텐츠, 작성자 모두 포함된다! => 즉 일부라도 일치하는건 모두 반환!)
// posts?category={String}&content={String}&sort[field]={String}&sort[type]={String}&page={Number}&limit={Number}
postRouter.get(
  "/posts",
  isValidData("post-sorting"),
  invalidCallback,
  async (req, res, next) => {
    try {
      const { category, content, sort, page, limit } = req.query;
      
      const TypeCheck = (variable) => {
        if (typeName(variable) === "Array" || typeName(variable) == "Object") {
          throw new Error(
            `${variable}를 보낼 시, api 문서에 기재된 query string 형식을 준수하세요.`
          );
        }
      };

      TypeCheck(category);
      TypeCheck(content);
      TypeCheck(limit);
      TypeCheck(page);

      // parameters ex) page: 2, limit: 10, tags: ['elice', encodeURI('봄')]
      // ※ 예시에서 encodeURI('봄') 으로 표현한 이유는 "유니코드인 한글"은 "URL 인코딩"되기 때문이다
      const posts = await postService.getSearchPosts({
        category,
        content,
        sort,
        page,
        limit,
      });

      res.status(200).json(posts);
    } catch (err) {
      next(err);
    }
  }
);

// update
postRouter.put('/posts/:postId', loginRequired, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await postService.getPost({ postId });
    if (!post) {
      const errorMessage = "Error: 해당 게시글이 존재하지 않습니다.";
      throw new Error(errorMessage);
    }

    const title = req.body.title ?? null;
    const content = req.body.content ?? null;
    const tags = req.body.tags ?? null;
    const userId = req.body.userId ?? null;
    const subjectId = req.body.subjectId ?? null;
    const category = req.body.category ?? null;

    if (!userId || !subjectId) {
      const errorMessage = "Error: Invalid data";
      throw new Error(errorMessage);
    }

    const toUpdate = {
      title,
      content,
      tags,
      userId,
      subjectId,
      category
    }

    const updatedPost = await postService.setPost({ postId, toUpdate });

    if (updatedPost.errorMessage) {
      throw new Error(updatedPost.errorMessage);
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    next(err);
  }
});


// delete
// 1. postId 로 해당 글 삭제
postRouter.delete('/posts/:postId', loginRequired, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.currentUserId;

    const result = await postService.deletePost({ postId, userId });
    if (result.errorMessage) {
      throw new Error(result.errorMessage);
    }

    res.status(200).json({ message: 'success'});
  } catch (err) {
    next(err);
  }
})

// 2. userId로 해당 유저의 글 모두 삭제
// 전 : /posts/users/:userId
// 후 : /users/:userId/posts
postRouter.delete('/users/:userId/posts', loginRequired, async (req, res, next) => {
  try {
    const { userId } = req.params;
  
    const result = await postService.deletePostsByUserId({ userId });
    if (result.errorMessage) {
      throw new Error(result.errorMessage);
    }

    res.status(200).json({ message: 'success'});
  } catch (err) {
    next(err);
  }
})

// 글 이미지 업로드 => POST /posts/:postId/uploadImage
// body = formData(filename: 이미지, prevImage: 이전 이미지 url)
postRouter
  .post('/posts/:postId/uploadImage',
    loginRequired, 
    uploader('post'), 
    deleteImg,
    async (req, res, next) => {
      try {
        console.log(req.files);
        const { postId } = req.params;
        const obj = req.files[0];
        const dirName = obj.bucket.split("/")[1];
        const imageName = obj.key;
        const imageUrl = `https://team2.cdn.ntruss.com/${dirName}/${imageName}`;
        const toUpdate = {
            imageUrl, 
        };
        const setPost = await postService.setPost({ postId, toUpdate });
        res.status(201).json({ message: "success" });
      } catch (err) {
          next(err);
      } 
});

// 삭제  PATCH /posts/:postId/removeImage
// body = { key: 파일명 }
postRouter
  .patch('/posts/:postId/removeImage',
    loginRequired,  
    deleteImg,
    async (req, res, next) => {
      try {
        console.log(req.files);
        const { postId } = req.params;
        const toUpdate = {
            imageUrl: "https://team2.cdn.ntruss.com/posts/default.png", 
        };
        const setPost = await postService.setPost({ postId, toUpdate });
        res.status(200).json({ message: "success" });
      } catch (err) {
          next(err);
      } 
});



export { postRouter };