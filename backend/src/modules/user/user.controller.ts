import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller({
  path: 'admin/users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public create(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.userService.create(dto);
  }

  @Get()
  public findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  public update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserRequestDto): Promise<UserResponseDto> {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
