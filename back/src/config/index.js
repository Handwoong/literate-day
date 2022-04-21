// env 변수 설정 파일(dotenv의 남용 방지)
import dotenv from "dotenv";
dotenv.config();

const config = {
    'port': process.env.PORT,
    'mongodbUrl': process.env.MONGODB_URL,
    'jwt': process.env.JWT_SECRET_KEY,
    'kakao': {
        'authKey': process.env.KAKAO_AUTH_KEY,
    },
}

export default config;