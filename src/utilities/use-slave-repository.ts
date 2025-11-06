import { DataSource } from 'typeorm';

export async function useSlaveRepository<T>(
  dataSource: DataSource,
  repositoryClass: new (...args: any[]) => T,
  callback: (repository: T) => Promise<any>,
):Promise<any> {
  const qr = dataSource.createQueryRunner('slave');
  await qr.connect();
  try {
    let repo: T;
    if (repositoryClass.length >= 2) {
      repo = new repositoryClass(dataSource, qr.manager);
    } else {
      repo = new repositoryClass(qr.manager);
    }
    return  await callback(repo);
  } finally {
    await qr.release();
  }
}
