import { RequestPayloadBuilder } from './components/requestPayloadBuilder';

const request = new RequestPayloadBuilder()
  .setUser('John Doe', 'john.doe@example.com')
  .setFilters({ country: 'USA', ageRange: [25, 35] })
  .setPagination(1, 10)
  .include('posts', 'comments')
  .build()

  console.log(request);
