import { DataSource } from 'typeorm';

export class TestDatabaseHelper {
  constructor(private readonly dataSource: DataSource) {}

  async cleanDatabase(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
    const entities = this.dataSource.entityMetadatas;
    const tableNames = entities.map((entity) => `"${entity.tableName}"`).join(', ');

    if (tableNames.length > 0) {
      await this.dataSource.query(`TRUNCATE TABLE ${tableNames} CASCADE;`);
    }
  }

  async synchronizeSchema(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
    // Drops and recreates all schema objects (destructive). For actual migration
    // execution use dataSource.runMigrations() instead.
    await this.dataSource.synchronize(true);
  }
}
