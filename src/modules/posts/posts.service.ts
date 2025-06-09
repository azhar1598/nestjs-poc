import { Injectable, BadRequestException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DatabaseService } from '../../database/datasource';

@Injectable()
export class PostsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createPostDto: CreatePostDto) {
    const supabase = this.databaseService.getClient();

    // Map camelCase to snake_case for Supabase
    const postToInsert = {
      title: createPostDto.title,
      content: createPostDto.content,
      author_id: createPostDto.authorId,
    };
    console.log(postToInsert);
    const { data, error } = await supabase
      .from('posts')
      .insert([postToInsert])
      .select()
      .single();
    if (error) {
      console.error('Supabase insert error:', error);
      throw new BadRequestException(error.message || 'Failed to create post');
    }
    return data;
  }

  findAll() {
    // Implement logic to return all posts
    return 'This action returns all posts';
  }

  findOne(id: number) {
    // Implement logic to return a single post by id
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    // Implement logic to update a post
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    // Implement logic to remove a post
    return `This action removes a #${id} post`;
  }
}
