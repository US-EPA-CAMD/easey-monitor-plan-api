import { DataSource } from 'typeorm';

export async function useSlaveRepository<T>(
  dataSource: DataSource,
  repositoryClass: new (repoInstance) => T,
  callback: (repository: T) => Promise<any>,
):Promise<any> {
  const qr = dataSource.createQueryRunner('slave');
  try {
    const repo = new repositoryClass(qr.manager);
    return  await callback(repo);
  } finally {
    await qr.release();
  }
}
