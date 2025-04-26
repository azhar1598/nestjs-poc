import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/datasource';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { data, error } = await this.databaseService
      .getClient()
      .from('users')
      .insert(createUserDto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll(): Promise<User[]> {
    const { data, error } = await this.databaseService
      .getClient()
      .from('clients')
      .select('*');

    if (error) throw error;
    return data;
  }

  async findOne(id: string): Promise<User> {
    const { data, error } = await this.databaseService
      .getClient()
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}
