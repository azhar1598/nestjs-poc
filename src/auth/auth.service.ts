import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from '../database/datasource';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Use Supabase client for authentication
    const supabase = this.databaseService.getClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: data.session.access_token,
      user: data.user,
    };
  }
}
