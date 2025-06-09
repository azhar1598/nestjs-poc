import { Injectable, BadRequestException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DatabaseService } from '../../database/datasource';

@Injectable()
export class PostsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createPostDto: CreatePostDto) {
    const supabase = this.databaseService.getClient();
    const slug = generateSlug(createPostDto.title);

    // Map camelCase to snake_case for Supabase
    const postToInsert = {
      title: createPostDto.title,
      content: createPostDto.content,
      author_id: createPostDto.authorId,
      slug,
      focus_keywords: createPostDto.focusKeywords,
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

  async findAll() {
    const supabase = this.databaseService.getClient();
    const { data, error } = await supabase.from('posts').select('*');
    if (error) {
      throw new BadRequestException(error.message || 'Failed to fetch posts');
    }
    return data;
  }

  async findOne(slug: string) {
    const supabase = this.databaseService.getClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) {
      throw new BadRequestException(error.message || 'Failed to fetch post');
    }
    return data;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const supabase = this.databaseService.getClient();

    const postToInsert: any = {};
    if (updatePostDto.title) {
      postToInsert.title = updatePostDto.title;
      postToInsert.slug = generateSlug(updatePostDto.title);
    }
    if (updatePostDto.focusKeywords) {
      postToInsert.focus_keywords = updatePostDto.focusKeywords;
    }
    if (updatePostDto.content) postToInsert.content = updatePostDto.content;
    if (updatePostDto.authorId) postToInsert.author_id = updatePostDto.authorId;

    const { data, error } = await supabase
      .from('posts')
      .update(postToInsert)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      throw new BadRequestException(error.message || 'Failed to update post');
    }
    return data;
  }

  async remove(id: number) {
    const supabase = this.databaseService.getClient();
    const { data, error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      throw new BadRequestException(error.message || 'Failed to delete post');
    }
    return data;
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/(^-|-$)+/g, ''); // Remove leading/trailing hyphens
}
