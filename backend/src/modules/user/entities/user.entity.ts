import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: 'users',
})
export class UserEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'username',
        type: 'varchar',
        length: 150,
        unique: true,
        nullable: false,
    })
    username: string;

    @Column({
        name: 'password',
        type: 'varchar',
        length: 260,
        select: false,
        nullable: false,
    })
    password: string;

    @Column({
        name: 'is_active',
        type: 'boolean',
        default: true,
        nullable: false,
    })
    isActive: boolean;

    @CreateDateColumn({
        name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
    })
    updatedAt: Date;

    @DeleteDateColumn({
        name: 'deleted_at',
    })
    deletedAt: Date;

    constructor(partial?: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
