import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RedisService } from '../../redis/redis.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly redisService: RedisService,
  ) {}

  public async create(dto: CreateUserRequestDto): Promise<UserResponseDto> {
    try {
      let entity = UserMapper.toCreateEntity(dto);
      entity = await this.userRepository.save(entity);
      return UserMapper.toDto(entity);
    } catch (error) {
      throw error;
    }
  }

  public async findAll(): Promise<UserResponseDto[]> {
    try {
        const entities = await this.userRepository.find();
        const items = Promise.all(
          entities.map((item) => UserMapper.toDto(item)),
        );
        return items;
    } catch (error) {
      throw error;
    }
  }

  public async findOne(id: number): Promise<UserResponseDto> {
    const cacheKey = `user:${id}`;

    const cacheUser = await this.redisService.get<UserResponseDto>(cacheKey);
    if (cacheUser) return cacheUser;

    const entity = await this.userRepository.findOneBy({ id });
    if (!entity) throw new NotFoundException('User not found');
    
    const user = UserMapper.toDto(entity);

    await this.redisService.set(
      cacheKey,
      user,
      300,
    );

    return user;

  }

  public async update(id: number, dto: UpdateUserRequestDto): Promise<UserResponseDto> {
    let entity = await this.userRepository.findOneBy({ id });
    if (!entity) throw new NotFoundException('User not found');
    entity = UserMapper.toUpdateEntity(entity, dto);
    entity = await this.userRepository.save(entity);
    await this.redisService.delete(`user:${id}`);
    return UserMapper.toDto(entity);   
  }

  public async remove(id: number): Promise<void> {
    try {
      const entity = await this.userRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('User not found');
      await this.redisService.delete(`user:${id}`);
      await this.userRepository.softDelete(id);
    } catch (error) {
      throw error;
    }
  }
}
