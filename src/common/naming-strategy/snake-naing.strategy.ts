import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

function pluralize(name: string): string {
  if (name.endsWith('y')) {
    return name.slice(0, -1) + 'ies';
  }
  if (name.endsWith('s')) {
    return name + 'es';
  }
  return name + 's';
}

export class SnakeNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  tableName(className: string, customName: string): string {
    const name = customName ? customName : className;
    return snakeCase(pluralize(name));
  }

  columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    return snakeCase(embeddedPrefixes.concat(customName ? customName : propertyName).join('_'));
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(`${relationName}_${referencedColumnName}`);
  }

  joinTableName(firstTableName: string, secondTableName: string, firstPropertyName: string, secondPropertyName: string): string {
    return snakeCase(`${firstTableName}_${firstPropertyName}_${secondTableName}`);
  }

  joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string {
    return snakeCase(`${tableName}_${columnName ? columnName : propertyName}`);
  }
}
