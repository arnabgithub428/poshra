import Dexie, { type Table } from 'dexie'

export interface Customer {
  id?: number
  name: string
  phone?: string
  due: number
  dueDate?: string // YYYY-MM-DD
  createdAt?: number
}

export interface Item {
  name: string
  qty: number
  price: number
}

export interface Txn {
  id?: number
  customerId: number
  type: 'due' | 'payment'
  items?: Item[]
  amount: number
  dueDate?: string
  note?: string
  createdAt: number
  synced: 0 | 1
}

export interface Product {
  id?: number
  name: string
  qty: number
  costPrice: number
  salePrice: number
  lowAt: number
}

class PoshraDB extends Dexie {
  customers!: Table<Customer>
  txns!: Table<Txn>
  products!: Table<Product>

  constructor() {
    super('poshra')
    this.version(2).stores({
      customers: '++id, name, phone, dueDate',
      txns: '++id, customerId, type, createdAt, synced',
      products: '++id, name',
    })
  }
}

export const db = new PoshraDB()