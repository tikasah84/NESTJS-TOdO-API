import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todo/todo.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(
    {
      isGlobal: true,
      envFilePath: '.env'
    }
  ),PrismaModule, AuthModule, TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
