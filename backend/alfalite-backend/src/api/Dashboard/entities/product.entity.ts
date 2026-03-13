import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text', { array: true })
  location: string[];

  @Column('text', { array: true })
  application: string[];

  @Column()
  horizontal: number;

  @Column()
  vertical: number;

  @Column('double precision', { name: 'pixel_pitch' })
  pixelPitch: number;

  @Column('double precision')
  width: number;

  @Column('double precision')
  height: number;

  @Column('double precision')
  depth: number;

  @Column('double precision')
  consumption: number;

  @Column('double precision')
  weight: number;

  @Column()
  brightness: number;

  @Column('double precision', { name: 'refresh_rate', nullable: true })
  refreshRate: number;

  @Column({ nullable: true })
  contrast: string;

  @Column({ name: 'vision_angle', nullable: true })
  visionAngle: string;

  @Column({ nullable: true })
  redundancy: string;

  @Column({ name: 'curved_version', nullable: true })
  curvedVersion: string;

  @Column({ name: 'optical_multilayer_injection', nullable: true })
  opticalMultilayerInjection: string;

  @Column({ nullable: true })
  image: string;
}
