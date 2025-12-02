import { QueryBuilder } from './components/queryBuilder';

const query = new QueryBuilder()
  .searchTerm('example')
  .where('role', 'admin')
  .sort('name')
  .order('asc')
  .paginate(1, 10)
  .build();

  console.log(query);