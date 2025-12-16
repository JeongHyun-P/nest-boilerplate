import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from 'src/modules/admin/entities/admin.entity';

export class AdminSeeder implements Seeder {
  // static priority = 1;

  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const adminRepo = dataSource.getRepository(Admin);
    const adminId = 'admin';

    const findAdmin = await adminRepo.findOne({ where: { loginId: adminId } });
    if (findAdmin) {
      return;
    }

    const password = process.env.ADMIN_DEFAULT_PASSWORD || '';
    const hashRounds = Number(process.env.JWT_HASH_ROUNDS) || 10;

    const admin = adminRepo.create({
      loginId: adminId,
      password: await bcrypt.hash(password, hashRounds)
    });

    await adminRepo.save(admin);
  }
}
