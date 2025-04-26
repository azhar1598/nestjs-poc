import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private supabaseClient: SupabaseClient;
  private supabaseServiceRoleClient: SupabaseClient;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    const supabaseServiceRoleKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      throw new Error(
        'Missing Supabase configuration. Please check your environment variables: ' +
          'SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY',
      );
    }

    this.supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    this.supabaseServiceRoleClient = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
    );
  }

  getClient(): SupabaseClient {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }
    return this.supabaseClient;
  }

  getServiceClient(): SupabaseClient {
    if (!this.supabaseServiceRoleClient) {
      throw new Error('Supabase service role client not initialized');
    }
    return this.supabaseServiceRoleClient;
  }
}

console.log('lolllllSUPABASE_URL:', process.env.SUPABASE_URL);
console.log(
  'SUPABASE_ANON_KEY:',
  process.env.SUPABASE_ANON_KEY ? 'exists' : 'missing',
);
console.log(
  'SUPABASE_SERVICE_ROLE_KEY:',
  process.env.SUPABASE_SERVICE_ROLE_KEY ? 'exists' : 'missing',
);
