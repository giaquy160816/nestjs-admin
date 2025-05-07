// Nếu viết trong file đang dùng:
interface JwtDecryptedPayload {
    sub: number;
    email: string;
    fullname?: string;
    roles: string; // nếu dùng string, hoặc string[] nếu không join
}