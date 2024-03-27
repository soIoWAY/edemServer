import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma.service';
import { jwtSecret } from '../utils/constants';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(dto: AuthDto) {
    const { username, password } = dto;
    const foundUser = await this.prisma.user.findUnique({
      where: { username },
    });
    if (foundUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    await this.prisma.user.create({
      data: {
        username,
        hashedPassword,
      },
    });
    return { message: 'signup was successfully' };
  }

  async signin(dto: AuthDto, req: Request, res: Response) {
    const { username, password } = dto;
    const foundUser = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!foundUser) {
      throw new BadRequestException('Wrong credentials');
    }

    const isMatch = await this.comparePassword({
      password,
      hash: foundUser.hashedPassword,
    });

    if (!isMatch) {
      throw new BadRequestException('Wrong credentials');
    }

    const token = await this.signToken({
      id: foundUser.id,
      username: foundUser.username,
      role: foundUser.role,
    });

    if (!token) {
      throw new ForbiddenException();
    }

    res.cookie('token', token, {
      maxAge: 25 * 60 * 1000,
      sameSite: 'none',
      httpOnly: true,
      secure: true,
    });

    return res.send({ message: 'Logged in successfully' });
  }

  async signout(req: Request, res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Logged out successfully' });
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePassword(args: { password: string; hash: string }) {
    return await bcrypt.compare(args.password, args.hash);
  }

  async signToken(args: { id: string; username: string; role: string }) {
    const payload = args;

    return this.jwt.signAsync(payload, { secret: jwtSecret });
  }
}
