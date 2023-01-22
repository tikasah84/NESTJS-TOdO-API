import { Injectable ,HttpException,HttpStatus} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}
  async create(createTodoDto: CreateTodoDto,req: any,file: Express.Multer.File) {
    const {title,description} = createTodoDto
    return await this.prisma.task.create({
      data: {
        title: title,
        description: description,
        file: file.originalname,
        user: 
        {
          connect: {
            id: req.user.id
          }
        }
      },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          file: true,
        }
      });
  }

  async findAll(req:any,status:string) {
    if(!status){
    return await this.prisma.task.findMany({
      where: {
        userId: req.user.id
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        file: true,
      }
    })}
    else{
      return await this.prisma.task.findMany({
        where: {
          userId: req.user.id,
          status: status
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          file: true,
        }
      })
    }
  }

 async findOne(id: number,req:any) {
    return await this.prisma.task.findMany({
      where: {
        id: id,
        userId: req.user.id
      },
    })
  }

 async update(id: number, updateTodoDto: UpdateTodoDto,req:any) {
    const {title,description,file,status} = updateTodoDto
    const data = await this.prisma.task.findFirst({
      where: {
        id: id,
        userId: req.user.id
      },
    });
    if(!data){
      throw new HttpException('Todo Not Found',404)
    }
    if(data.status == "completed"){
      throw new HttpException('Todo Already Completed',HttpStatus.FORBIDDEN)
    }
    try{
    return await this.prisma.task.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        description: description,
        file: file,
        status: status
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
      }
    })
  }catch(err){
    throw new HttpException(err.message,HttpStatus.INTERNAL_SERVER_ERROR)
}}

  async remove(id: number,req:any) {
    const data = await this.prisma.task.findFirst({
      where: {
        id: id,
        userId: req.user.id
      },
    });
    if(data){
      return await this.prisma.task.delete({
        where: {
          id: id,
        },
      });
    }else{
      throw new HttpException('Not Found',404)
    }
  }
    
}
