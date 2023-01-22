import { Controller,Request,Query, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() createTodoDto: CreateTodoDto,@Request()  req,@UploadedFile() file: Express.Multer.File) {
    return this.todoService.create(createTodoDto,req,file);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request()  req,@Query('status') status: string) {
    return this.todoService.findAll(req,status);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string,@Request()  req) {
    return this.todoService.findOne(+id,req);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto,@Request()  req) {
    return this.todoService.update(+id, updateTodoDto,req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string,@Request()  req) {
    return this.todoService.remove(+id,req);
  }
}
