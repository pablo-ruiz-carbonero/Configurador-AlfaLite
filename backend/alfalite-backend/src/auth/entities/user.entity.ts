import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  // Seleccionamos false para que por defecto no devuelva el hash en las consultas
  @Column({ select: false })
  password_hash: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
