import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const balacence = transactions.reduce(
      (previous: Balance, current: Transaction) => {
        if (current.type === 'income') {
          // eslint-disable-next-line no-param-reassign
          previous.income += Number(current.value);
        } else if (current.type === 'outcome') {
          // eslint-disable-next-line no-param-reassign
          previous.outcome += Number(current.value);
        }
        // eslint-disable-next-line no-param-reassign
        previous.total = Number(previous.income) - Number(previous.outcome);
        return previous;
      },
      { income: 0, outcome: 0, total: 0 },
    );
    return balacence;
  }
}

export default TransactionsRepository;
