import { Inject, Injectable } from '@nestjs/common';
import { CreateDoctorDto } from '../auth/dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { db } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from 'src/db/index';
import bcrypt from 'bcrypt';
@Injectable()
export class DoctorsService {
  constructor(@Inject(db) private readonly db: NodePgDatabase<typeof schema>) {}

  async create(doctorData: CreateDoctorDto) {
    const { firstName, lastName, email, password, clinicName } = doctorData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [newDoctor] = await this.db
      .insert(schema.doctors)
      .values({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        clinicName,
      })
      .returning();
    return newDoctor;
  }

  findAll() {
    return `This action returns all doctors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctor`;
  }

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctor`;
  }

  async findByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(schema.doctors)
      .where(eq(schema.doctors.email, email));
    return user;
  }
}
