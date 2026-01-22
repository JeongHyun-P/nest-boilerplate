import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

// 커스텀 네이밍 전략
// - 코드: camelCase, 단수
// - DB: snake_case, 복수
export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  // 테이블명: 복수형 + snake_case
  tableName(className: string, customName: string): string {
    if (customName) {
      return customName;
    }
    return this.toSnakeCase(this.toPlural(className));
  }

  // 컬럼명: snake_case
  columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    if (customName) {
      return customName;
    }
    const prefix = embeddedPrefixes.length > 0 ? embeddedPrefixes.join('_') + '_' : '';
    return prefix + this.toSnakeCase(propertyName);
  }

  // 관계 컬럼명: snake_case
  relationName(propertyName: string): string {
    return this.toSnakeCase(propertyName);
  }

  // Join 컬럼명: snake_case + _id
  joinColumnName(relationName: string, referencedColumnName: string): string {
    return this.toSnakeCase(relationName) + '_' + referencedColumnName;
  }

  // Join 테이블명: snake_case
  joinTableName(firstTableName: string, secondTableName: string): string {
    return this.toSnakeCase(firstTableName) + '_' + this.toSnakeCase(secondTableName);
  }

  // Join 테이블 컬럼명
  joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string {
    return this.toSnakeCase(tableName) + '_' + (columnName || this.toSnakeCase(propertyName));
  }

  // camelCase → snake_case 변환
  private toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
  }

  // 단수 → 복수 변환 (간단한 규칙)
  private toPlural(str: string): string {
    // 이미 복수형인 경우 그대로 반환
    if (str.endsWith('s') || str.endsWith('es')) {
      return str;
    }

    // 특수 케이스
    const irregulars: Record<string, string> = {
      child: 'children',
      person: 'people',
      man: 'men',
      woman: 'women',
      tooth: 'teeth',
      foot: 'feet',
      mouse: 'mice',
      goose: 'geese'
    };

    const lower = str.toLowerCase();
    if (irregulars[lower]) {
      return str.charAt(0) + irregulars[lower].slice(1);
    }

    // -y로 끝나는 경우 (자음 + y → ies)
    if (str.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(str.charAt(str.length - 2).toLowerCase())) {
      return str.slice(0, -1) + 'ies';
    }

    // -s, -x, -z, -ch, -sh로 끝나는 경우 → es
    if (/[sxz]$/.test(str) || /[cs]h$/.test(str)) {
      return str + 'es';
    }

    // 기본: s 추가
    return str + 's';
  }
}
