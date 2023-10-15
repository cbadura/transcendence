export interface IAuth {
  validateUser(userId: number);
  createUser(userId: number);
  findUser(userId: number);
}