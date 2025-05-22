const BASE_URL = 'https://jsonplaceholder.typicode.com/'
export const apiRoutes = {
  getUsers: `${BASE_URL}users`,
  getUserById: (id: string) => `${BASE_URL}users/${id}`,
}