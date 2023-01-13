/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class AccountTransaction {

    @Property()
    public TypeTransaction: string;
    public Ammount: number;
    public AmmountComission: number;
    public Description: string;
    public CreateDate: Date;
    public Balance: number;
    public From: string;
    public To: string;
    public Commission: number;
    public Bank: string;
    public direccionSend: string;
    public id: number;
    public txid: string;
    public txidRedBtc: string
}
export class TxidTransaction {
    @Property()
    public TypeTransactionTx: string;
    public AccountIdTx: string;
    public AmmountTx: number;
    public BankTx: string;
    public CreateDateTx: Date;
}
export class ConcilBank {
    @Property()
    public Bank: string;
    public Amount: number;
    public CreateDate: Date;
    public Accion: string;
}
export class TypeComission {
    @Property()
    public Operation: string;
    public Description: string;
    public Desciption2: string;
    public CreateDate: Date;
   
}
export class Commission {
    @Property()
    public Operation: string;
    public Description: string;
    public CreateDate: Date;
    public amount: number;
    public bank: string;
   
}

