import { Injectable,BadRequestException,ForbiddenException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,
    private jwtService: JwtService
    ) {}

  async create(createAuthDto: CreateAuthDto) {
    const {email,password} = createAuthDto

    const checkUnique = await this.prisma.user.findFirst({
      where:{
        email:email
      }
    })
    if(checkUnique){
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password,10);
    
    return  await this.prisma.user.create({
      data:{
        email:email,
        password:hashedPassword
      },
      select:{
        id:true,
        email:true,
        name:true
      }
      
    }
   ); 
  }

  async findAll() {
    const AllUsers= await this.prisma.user.findMany({select:{
      id:true,
      email:true,
      name:true
    }})
    return AllUsers
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({where:{id:id},
      select:{
        id:true,
        email:true,
        name:true
      }});
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    const {email,password} = updateAuthDto;
    if(email==undefined){
      return this.prisma.user.update({
        where:{
          id:id
        },
        data:{
          password:await bcrypt.hash(password,10)
        },
        select:{
          id:true,
          email:true,
        }
      });
    }
    const checkUnique = await this.prisma.user.findFirst({
      where:{
        email:email
      }
    })
    if(checkUnique){
      throw new BadRequestException('Email already exists');
    }else{
    return this.prisma.user.update({
      where:{
        id:id
      },
      data:{
        email:email,
      },
      select:{
        id:true,
        email:true,
      }
    });
   }
    
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where:{
        id:id
      }
  });
}



async signin(dto: CreateAuthDto) {
  const { email, password } = dto;
  const foundUser = await this.prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!foundUser) {
    throw new BadRequestException('Wrong credentials');
  }
  
  const compareSuccess = await bcrypt.compare(password, foundUser.password);
  if (!compareSuccess) {
    throw new BadRequestException('Password Wrong');
  }
const payload = {
  userId: foundUser.id,
  email: foundUser.email,
}
try{
  const token = await this.jwtService.sign(payload,{expiresIn:'1h'});
  return { message: 'Logged in succefully', "token":token }
}catch(e){
  throw new ForbiddenException(e);
}
};






async signout() {
  return { message: 'Logged out succefully' };
}
}
