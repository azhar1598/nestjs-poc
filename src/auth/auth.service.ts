import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from '../database/datasource';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    console.log(email, password, 'creds');

    // Use Supabase client for authentication
    const supabase = this.databaseService.getClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log(data, 'newerr', error);
    if (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: data.session.access_token,
      user: data.user,
    };
  }

  async signup(signupDto: SignupDto) {
    const { name, email, password } = signupDto;
    const supabase = this.databaseService.getClient();

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    const userId = data.user?.id;
    if (userId) {
      const { error: profileError } = await supabase.from('users').insert([
        {
          id: userId,
          name: name,
          email: email,
          email_confirmed_at: new Date(),
          email_confirmed: true,
        },
      ]);

      if (profileError) {
        // You can choose to throw or just log
        console.error('user insert error:', profileError.message);
      }
    }

    return { user: data.user };
  }
}
