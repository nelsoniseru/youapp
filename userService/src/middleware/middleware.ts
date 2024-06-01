import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

/**
 * AuthenticationMiddleware is a middleware class that handles JWT authentication.
 * It checks the presence and validity of the JWT token in the Authorization header of incoming requests.
 */
@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) { }

    /**
     * The use method is called for each incoming request.
     * It checks for the Authorization header, verifies the JWT token, and attaches the user ID to the request object.
     * @param request - The incoming request object
     * @param response - The outgoing response object
     * @param next - The next middleware function in the request-response cycle
     * @throws UnauthorizedException - If the Authorization header is missing or the token is invalid
     */
    async use(request, response, next) {
        const authorization = request.headers.authorization;

        if (!authorization) {
            throw new UnauthorizedException('Authorization header is missing');
        }

        const token = authorization.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Token is missing');
        }

        try {
            const claims = await this.jwtService.verifyAsync(token);
            request.user = claims.id;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }

        next();
    }
}
