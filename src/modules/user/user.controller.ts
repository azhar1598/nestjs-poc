import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { SupabaseAuthGuard } from '../../auth/supabase-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ValidationExceptionsFilter } from '../../filters/validation-exceptions.filter';
import { DatabaseExceptionsFilter } from '../../filters/database-exceptions.filter';

@ApiBearerAuth()
@Controller('clients')
@UseFilters(ValidationExceptionsFilter, DatabaseExceptionsFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(SupabaseAuthGuard)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  getMe(@Req() req) {
    // req.user is set by the guard
    return req.user;
  }
}
