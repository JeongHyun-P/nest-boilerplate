import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Term } from 'src/modules/term/entities/term.entity';
import { TermType } from 'src/modules/term/constants/term-type.enum';

export class TermSeeder implements Seeder {
  // static priority = 1;

  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const termRepo = dataSource.getRepository(Term);

    const findTerms = await termRepo.find();
    if (findTerms.length) {
      return;
    }

    const termsData = [
      {
        type: TermType.SERVICE,
        version: 1,
        content: '서비스 이용 약관 v1 내용'
      },
      {
        type: TermType.PRIVACY,
        version: 1,
        content: '개인정보 처리 방침 v1 내용'
      }
    ];

    const termPromises = termsData.map(async (termData) => {
      return termRepo.create(termData);
    });

    const terms = await Promise.all(termPromises);

    if (terms.length > 0) {
      await termRepo.save(terms);
    }
  }
}
