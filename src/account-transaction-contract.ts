/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { AccountTransaction,ConcilBank,TxidTransaction, TypeComission, Commission } from './account-transaction';

@Info({title: 'AccountTransactionContract', description: 'My Smart Contract' })
export class AccountTransactionContract extends Contract {
  
  @Transaction()
  public async destroyQbtc(ctx: Context, vartxidRednegocio: string,vartxidRedBtc:string,varfrom: string,varto: string,vbank:string, vammount: number): Promise<void> {
     try {
      const MydestroyQbtc: AccountTransaction = new AccountTransaction();
      MydestroyQbtc.txid = vartxidRednegocio;
      MydestroyQbtc.txidRedBtc = vartxidRedBtc;
      MydestroyQbtc.direccionSend = varto;
      MydestroyQbtc.Ammount = vammount;
      MydestroyQbtc.From = varfrom;
      MydestroyQbtc.To = varto;
      MydestroyQbtc.CreateDate = new Date;
      const buffer: Buffer = Buffer.from(JSON.stringify(MydestroyQbtc));
      await ctx.stub.putState(`${vbank}.SendBTC.destroy@quant.com`, buffer);
     }
     catch {
      throw new Error(JSON.stringify({error:4020, descripcion:'Fallo la destruccion de los BTC'}));
     }

  }
  @Transaction(false)
    @Returns('Comission')
    public async readTypeComission(ctx: Context, commisionId: string): Promise<number> {
        try {
           const buffer = await ctx.stub.getState(commisionId);
           if (!!buffer && buffer.length > 0){
              const ReadComission: Commission = JSON.parse(buffer.toString()) as Commission;
              const comission = ReadComission.amount;
              return comission;
            }
           else {
             return 0;
           } 
           }
        catch {
            throw new Error(JSON.stringify({error:10000, descripcion:'fallo la lectura de la comision'}));
        }    
    }
  @Transaction()
  public async createTypeComission(ctx: Context, varoperation: string, vardescription1: string, vardescription2: string): Promise<void> {
      const myTypeComission: TypeComission = new TypeComission();
      myTypeComission.Operation = varoperation;
      myTypeComission.Description = vardescription1;
      myTypeComission.Desciption2 = vardescription2;
      myTypeComission.CreateDate = new Date();
      const buffer: Buffer = Buffer.from(JSON.stringify(myTypeComission));
      await ctx.stub.putState('comission@quant.com', buffer);
  }
  @Transaction()
  public async createComission(ctx: Context, varoperation: string, vardescription1: string, varbank: string, varammount: number): Promise<void> {
      const myComission: Commission = new Commission()
      myComission.bank = varbank;
      myComission.Description = vardescription1;
      myComission.Operation = varoperation;
      myComission.CreateDate = new Date();
      myComission.amount = varammount;
      const buffer: Buffer = Buffer.from(JSON.stringify(myComission));
      await ctx.stub.putState(`${varbank}.${varoperation}.${vardescription1}@quant.com`, buffer);
  }

  @Transaction(false)
  @Returns('boolean')
  public async accountTransactionExists(ctx: Context, accountTransactionId: string, Vbank: string): Promise<boolean> {
      const buffer = await ctx.stub.getState(accountTransactionId);
      if (!!buffer && buffer.length > 0){
          const acc: AccountTransaction = JSON.parse(buffer.toString());
          const var_bank = acc.Bank;
          return (!!buffer && buffer.length > 0 && var_bank == Vbank);
      }
    return (!!buffer && buffer.length > 0);
  }
  @Transaction(false)
  @Returns('boolean')
  public async OperationBalanceExists(ctx: Context, accountTransactionId: string, accountTransactionId2: string,Operacion: string, descrip: string, vbank: string,vbank2:string): Promise<boolean> {
    if ((Operacion == 'Retiro' ) && (descrip == 'Retiro Red Quant')) {
      const buffer1 = await ctx.stub.getState(accountTransactionId);
      return (!!buffer1 && buffer1.length > 0);
    }
    if ((Operacion == 'Deposito' ) && (descrip == 'Deposito Red Quant')) {
       const buffer2 = await ctx.stub.getState(accountTransactionId2);
       return (!!buffer2 && buffer2.length > 0);
    }
    if ((Operacion == 'Retiro' ) && (descrip == 'Retiro a Red BTC')) {
        const buffer3 = await ctx.stub.getState(accountTransactionId);
        return (!!buffer3 && buffer3.length > 0);
    }
    if ((Operacion == 'Deposito' ) && (descrip == 'Deposito TC')) {
        const buffer4 = await ctx.stub.getState(`${vbank}sendBTC@quant.com`);
        return (!!buffer4 && buffer4.length > 0);
    }

  }

  @Transaction(false)
  @Returns('boolean')
  public async accountBalanceExists(ctx: Context, accountTransactionId: string, Vbank: string, Vammount: number,Operacion: string): Promise<boolean> {
      const buffer = await ctx.stub.getState(accountTransactionId);
     if (Operacion == 'Retiro') {
      if (!!buffer && buffer.length > 0){
          const acc: AccountTransaction = JSON.parse(buffer.toString());
          const var_bank = acc.Bank;
          const var_balance = acc.Balance;
          return (!!buffer && buffer.length > 0 && var_bank == Vbank && var_balance >= Vammount);
      }
      return (!!buffer && buffer.length > 0)
    }
      if (Operacion == 'Deposito'){
          return(1==1)
      }
  }
  @Transaction(false)
  @Returns('boolean')
  public async TxidTransactionExists(ctx: Context, TxidTransactionId: string): Promise<boolean> {
      const buffer = await ctx.stub.getState(TxidTransactionId);
      return (!!buffer && buffer.length > 0);
  }
  @Transaction(false)
  @Returns('AccountTransaction')
  public async readAccountTransaction(ctx: Context, accountTransactionId: string, Vbank: string): Promise<AccountTransaction> {
      const exists = await this.accountTransactionExists(ctx, accountTransactionId, Vbank);
      if (!exists) {
        throw new Error(JSON.stringify({error: 200, descripcion: 'Cuenta no existe'}));;
      }
      const buffer = await ctx.stub.getState(accountTransactionId);
      const accountTransaction = JSON.parse(buffer.toString()) as AccountTransaction;
      return accountTransaction;
  }
  @Transaction(false)
  @Returns('boolean')
  public async ConcilBankExist(ctx: Context, Vbank: string, Vbank2: string, Operacion: string): Promise<boolean> {
    if (Operacion == 'Retiro') {
      const buffer1 = await ctx.stub.getState(Vbank);
      return (!!buffer1 && buffer1.length > 0);
    }
    if (Operacion == 'Deposito') {
      const buffer2 = await ctx.stub.getState(Vbank2);
      return (!!buffer2 && buffer2.length > 0);
  }  
  }
  @Transaction()
  public async createAccountTransactionComission(ctx: Context, accountTransactionId: string, accountTransactionId2: string, Vammount: number, Operacion: string, Vbank: string, Vbank2: string, Vdescription: string, varcomission:number): Promise<void> {
    try{  
      const  Vbanking = `${Vbank}@quant.com`;
      const exists = await this.accountTransactionExists(ctx,Vbanking,Vbank);
      if (exists) {
          const AccountTransactionRecord = await ctx.stub.getState(Vbanking); 
          const acc: AccountTransaction = JSON.parse(AccountTransactionRecord.toString());
          acc.TypeTransaction = Operacion;
          acc.Ammount = ((Vammount * varcomission)/100);
          acc.Description = Vdescription;
          acc.CreateDate = new Date();
          acc.Balance = ((Vammount * varcomission)/100) +  acc.Balance;
          acc.From = accountTransactionId;
          acc.To = accountTransactionId2;
          acc.Commission = varcomission;
          acc.Bank = Vbank;
          await ctx.stub.putState(Vbanking, Buffer.from(JSON.stringify(acc)));
          return;
          }
      else {
          const accountTransaction = new AccountTransaction();
          accountTransaction.TypeTransaction = Operacion;
          accountTransaction.Ammount = ((Vammount * varcomission)/100);
          accountTransaction.Description = Vdescription;
          accountTransaction.CreateDate = new Date();
          accountTransaction.Balance = ((Vammount * varcomission)/100);
          accountTransaction.From = accountTransactionId;
          accountTransaction.To = accountTransactionId2;
          accountTransaction.Commission = varcomission;
          accountTransaction.Bank = Vbank;
          const buffer = Buffer.from(JSON.stringify(accountTransaction));
          await ctx.stub.putState(Vbanking, buffer);
          return;
         }
        }
        catch {
          throw new Error(JSON.stringify({error:4000, descripcion:'Fallo la creación de la comision'}));
        }
  
       
  }
  @Transaction()
  public async createAccountTransactionBTC(ctx: Context, accountTransactionId: string, Vammount: number, VtxId: string, Vbank: string, Vcurrency: string): Promise<void> {
     try{ 
   if (Vcurrency=='1') {
      let varcomission = await this.readTypeComission(ctx,`${Vbank}.Deposito.Deposito Red BTC@quant.com`)
      const exists = await this.accountTransactionExists(ctx, accountTransactionId, Vbank);
      if (exists) {
          const AccountTransactionRecord = await ctx.stub.getState(accountTransactionId); 
          const acc: AccountTransaction = JSON.parse(AccountTransactionRecord.toString());
          acc.TypeTransaction = 'Deposito';
          acc.Ammount = Vammount;
          acc.AmmountComission = ((Vammount * varcomission)/100);
          acc.Description = `Deposito Red Bitcoin ${VtxId}`;
          acc.CreateDate = new Date();
          acc.Balance = (Vammount - ((Vammount * varcomission)/100)) + acc.Balance;
          acc.From = VtxId;
          acc.To = accountTransactionId;
          acc.Commission = varcomission;
          acc.Bank = Vbank;
          await ctx.stub.putState(accountTransactionId, Buffer.from(JSON.stringify(acc)));
          const txidtransaction = new TxidTransaction();
          const TxidTransactionId = VtxId;
          txidtransaction.AmmountTx = Vammount;
          txidtransaction.CreateDateTx = new Date();
          txidtransaction.TypeTransactionTx = 'Deposito';
          txidtransaction.BankTx = Vbank; 
          const buffer2 = Buffer.from(JSON.stringify(txidtransaction));
          await ctx.stub.putState(TxidTransactionId, buffer2);
          await this.createAccountTransactionComission(ctx, VtxId,accountTransactionId,Vammount,'Deposito',Vbank,VtxId,'Deposito Red BTC',varcomission);
          return;
          }
      const accountTransaction = new AccountTransaction();
      accountTransaction.TypeTransaction = 'Deposito';
      accountTransaction.Ammount = Vammount;
      accountTransaction.AmmountComission = ((Vammount * varcomission)/100);
      accountTransaction.Description = `Deposito Red Bitcoin ${VtxId}`;
      accountTransaction.CreateDate = new Date();
      accountTransaction.Balance = (Vammount - ((Vammount * varcomission)/100));
      accountTransaction.From = VtxId;
      accountTransaction.To = accountTransactionId;
      accountTransaction.Commission = varcomission;
      accountTransaction.Bank = Vbank;
      const buffer = Buffer.from(JSON.stringify(accountTransaction));
      await ctx.stub.putState(accountTransactionId, buffer);
      const txidtransaction = new TxidTransaction();
      const TxidTransactionId = VtxId;
      txidtransaction.AmmountTx = Vammount;
      txidtransaction.CreateDateTx = new Date();
      txidtransaction.TypeTransactionTx = 'Deposito';
      txidtransaction.BankTx = Vbank; 
      const buffer2 = Buffer.from(JSON.stringify(txidtransaction));
      await ctx.stub.putState(TxidTransactionId, buffer2);
      await this.createAccountTransactionComission(ctx, VtxId,accountTransactionId,Vammount,'Deposito',Vbank,VtxId,'Deposito Red BTC', varcomission);
    }
    else {
      await this.createAccountTransactionUSDT(ctx,accountTransactionId, Vammount, VtxId, Vbank, Vcurrency);
    }
    }
    catch {
      throw new Error(JSON.stringify({error:4020, descripcion:'Fallo la creación de deposito externo BTC'}));
    }
    }
    @Transaction()
    public async createAccountTransactionUSDT(ctx: Context, accountTransactionId: string, Vammount: number, VtxId: string, Vbank: string, Vcurrency: string): Promise<void> {
     if (Vcurrency=='2') {
        let varcomission = await this.readTypeComission(ctx,`${Vbank}.Deposito.Deposito Red USDT@quant.com`)
        const exists = await this.accountTransactionExists(ctx, `USDT.${accountTransactionId}`, Vbank);
        if (exists) {
            const AccountTransactionRecord = await ctx.stub.getState(`USDT.${accountTransactionId}`); 
            const acc: AccountTransaction = JSON.parse(AccountTransactionRecord.toString());
            acc.TypeTransaction = 'Deposito';
            acc.Ammount = Vammount;
            acc.AmmountComission = ((Vammount * varcomission)/100);
            acc.Description = `Deposito Red USDT ${VtxId}`;
            acc.CreateDate = new Date();
            acc.Balance = (Vammount - ((Vammount * varcomission)/100)) + acc.Balance;
            acc.From = VtxId;
            acc.To = accountTransactionId;
            acc.Commission = varcomission;
            acc.Bank = Vbank;
            await ctx.stub.putState(`USDT.${accountTransactionId}`, Buffer.from(JSON.stringify(acc)));
            const txidtransaction = new TxidTransaction();
            const TxidTransactionId = VtxId;
            txidtransaction.AmmountTx = Vammount;
            txidtransaction.CreateDateTx = new Date();
            txidtransaction.TypeTransactionTx = 'Deposito';
            txidtransaction.BankTx = Vbank; 
            const buffer2 = Buffer.from(JSON.stringify(txidtransaction));
            await ctx.stub.putState(TxidTransactionId, buffer2);
            await this.createAccountTransactionComission(ctx, VtxId,accountTransactionId,Vammount,'Deposito',Vbank,VtxId,'Deposito Red USDT',varcomission);
            return;
            }
        const accountTransaction = new AccountTransaction();
        accountTransaction.TypeTransaction = 'Deposito';
        accountTransaction.Ammount = Vammount;
        accountTransaction.AmmountComission = ((Vammount * varcomission)/100);
        accountTransaction.Description = `Deposito Red USDT ${VtxId}`;
        accountTransaction.CreateDate = new Date();
        accountTransaction.Balance = (Vammount - ((Vammount * varcomission)/100));
        accountTransaction.From = VtxId;
        accountTransaction.To = accountTransactionId;
        accountTransaction.Commission = varcomission;
        accountTransaction.Bank = Vbank;
        const buffer = Buffer.from(JSON.stringify(accountTransaction));
        await ctx.stub.putState(`USDT.${accountTransactionId}`, buffer);
        const txidtransaction = new TxidTransaction();
        const TxidTransactionId = VtxId;
        txidtransaction.AmmountTx = Vammount;
        txidtransaction.CreateDateTx = new Date();
        txidtransaction.TypeTransactionTx = 'Deposito';
        txidtransaction.BankTx = Vbank; 
        const buffer2 = Buffer.from(JSON.stringify(txidtransaction));
        await ctx.stub.putState(TxidTransactionId, buffer2);
        await this.createAccountTransactionComission(ctx, VtxId,accountTransactionId,Vammount,'Deposito',Vbank,VtxId,'Deposito Red USDT', varcomission);
      }
         }
      @Transaction()
       public async createAccountTransactionQusdtSNsignature(ctx: Context, accountTransactionId: string, accountTransactionId2: string, Vammount: number, Operacion: string, Vbank: string, Vbank2: string, Vdescription: string, Vcurrency: string): Promise<void> {
         if (Vcurrency=='2') {
           let varcomission = await this.readTypeComission(ctx,`${Vbank}.${Operacion}.${Vdescription}@quant.com`)
           const exists = await this.OperationBalanceExists(ctx, `USDT.${accountTransactionId}`,`USDT.${accountTransactionId2}`,Operacion,Vdescription,Vbank,Vbank2);
           const vbalance = await this.accountBalanceExists(ctx,`USDT.${accountTransactionId}`,Vbank,(Vammount + ((varcomission*Vammount)/100)),Operacion);  
           if (vbalance) {
             try {
               if (exists && (Operacion == 'Retiro') && Vdescription == 'Retiro Red Quant')  {
                 const AccountTransactionRecord = await ctx.stub.getState(`USDT.${accountTransactionId}`); 
                 const acc: AccountTransaction = JSON.parse(AccountTransactionRecord.toString());
                 acc.TypeTransaction = Operacion;
                 acc.Ammount = -(Vammount);
                 acc.Balance =   acc.Balance - (Vammount + ((Vammount*varcomission)/100));
                 acc.Commission = varcomission;
                 acc.AmmountComission = ((Vammount*varcomission)/100);
                 acc.Bank = Vbank;
                 acc.Description = Vdescription;
                 acc.CreateDate = new Date();
                 acc.From = accountTransactionId;
                 acc.To = accountTransactionId2;
                 await ctx.stub.putState(`USDT.${accountTransactionId}`, Buffer.from(JSON.stringify(acc)));
                 await this.createAccountTransactionComission(ctx, `USDT.${accountTransactionId}`,`USDT.${accountTransactionId2}`,Vammount,Operacion,Vbank,Vbank2,Vdescription,varcomission);  
               }
               if (exists && (Operacion == 'Deposito') && Vdescription == 'Deposito Red Quant')  {
                 const AccountTransactionRecord = await ctx.stub.getState(`USDT.${accountTransactionId2}`); 
                 const acc: AccountTransaction = JSON.parse(AccountTransactionRecord.toString());
                 acc.TypeTransaction = Operacion;
                 acc.Ammount = Vammount;
                 acc.Balance =   acc.Balance + Vammount; 
                 acc.Commission = 0;
                 acc.Bank = Vbank2;
                 acc.Description = Vdescription;
                 acc.CreateDate = new Date();
                 acc.From = accountTransactionId;
                 acc.To = accountTransactionId2;
                 await ctx.stub.putState(`USDT.${accountTransactionId2}`, Buffer.from(JSON.stringify(acc)));
               }
               if ((!exists) && Operacion == 'Deposito' && Vdescription == 'Deposito Red Quant'){
                     const accountTransaction = new AccountTransaction();
                     accountTransaction.TypeTransaction = Operacion;
                     accountTransaction.Ammount = Vammount;
                     accountTransaction.Balance = Vammount;
                     accountTransaction.Commission = 0;
                     accountTransaction.AmmountComission = 0;
                     accountTransaction.Bank = Vbank2;
                     accountTransaction.Description = Vdescription;
                     accountTransaction.CreateDate = new Date();
                     accountTransaction.From = accountTransactionId;
                     accountTransaction.To = accountTransactionId2;
                     const buffer = Buffer.from(JSON.stringify(accountTransaction));
                     await ctx.stub.putState(`USDT.${accountTransactionId2}`, buffer);
                }
             return;
             }
              catch {
               throw new Error(JSON.stringify({error:4200, descripcion:'Fallo la transaccion'}));;    
              }
          }
          else {
           throw new Error(JSON.stringify({error:4200, descripcion:'Balance no disponible'}));
          }
         }
         }
        
  @Transaction()
  public async createAccountTransactionQbtcSNsignature(ctx: Context, accountTransactionId: string, accountTransactionId2: string, Vammount: number, Operacion: string, Vbank: string, Vbank2: string, Vdescription: string, Vcurrency: string): Promise<void> {
  if (Vcurrency=='1') {
    let varcomission = await this.readTypeComission(ctx,`${Vbank}.${Operacion}.${Vdescription}@quant.com`)
    const exists = await this.OperationBalanceExists(ctx, accountTransactionId,accountTransactionId2,Operacion,Vdescription,Vbank,Vbank2);
    const vbalance = await this.accountBalanceExists(ctx,accountTransactionId,Vbank,(Vammount + ((varcomission*Vammount)/100)),Operacion);  
    if (vbalance) {
      try {
        if (exists && (Operacion == 'Retiro') && Vdescription == 'Retiro Red Quant')  {
          const AccountTransactionRecord = await ctx.stub.getState(accountTransactionId); 
          const acc: AccountTransaction = JSON.parse(AccountTransactionRecord.toString());
          acc.TypeTransaction = Operacion;
          acc.Ammount = -(Vammount);
          acc.Balance =   acc.Balance - (Vammount + ((Vammount*varcomission)/100));
          acc.Commission = varcomission;
          acc.AmmountComission = ((Vammount*varcomission)/100);
          acc.Bank = Vbank;
          acc.Description = Vdescription;
          acc.CreateDate = new Date();
          acc.From = accountTransactionId;
          acc.To = accountTransactionId2;
          await ctx.stub.putState(accountTransactionId, Buffer.from(JSON.stringify(acc)));
          await this.createAccountTransactionComission(ctx, accountTransactionId,accountTransactionId2,Vammount,Operacion,Vbank,Vbank2,Vdescription,varcomission);  
        }
        if (exists && (Operacion == 'Retiro') && (Vdescription == 'Retiro a Red BTC')) {
            const AccountTransactionRecord = await ctx.stub.getState(accountTransactionId); 
            const acc: AccountTransaction = JSON.parse(AccountTransactionRecord.toString());
            acc.TypeTransaction = Operacion;
            acc.Ammount = -(Vammount);
            acc.Balance =   acc.Balance - (Vammount + ((Vammount*varcomission)/100));
            acc.Commission = varcomission;
            acc.AmmountComission = ((Vammount*varcomission)/100);
            acc.Bank = Vbank;
            acc.Description = Vdescription;
            acc.CreateDate = new Date();
            acc.From = accountTransactionId;
            acc.To = accountTransactionId2;
            await ctx.stub.putState(accountTransactionId, Buffer.from(JSON.stringify(acc)));
            await this.createAccountTransactionComission(ctx, accountTransactionId,accountTransactionId2,Vammount,Operacion,Vbank,Vbank2,Vdescription,varcomission);
        }
        if (exists && (Operacion == 'Deposito') && (Vdescription == 'Deposito TC'))  {
            const AccountTransactionRecord = await ctx.stub.getState(`${Vbank}sendBTC@quant.com`); 
            const acc: AccountTransaction = JSON.parse(AccountTransactionRecord.toString());
            acc.TypeTransaction = Operacion;
            acc.Ammount = Vammount;
            acc.Balance =   acc.Balance + Vammount; 
            acc.Commission = 0;
            acc.AmmountComission = 0;
            acc.Bank = Vbank2;
            acc.Description = Vdescription;
            acc.txid=ctx.stub.getTxID();
            acc.CreateDate = new Date();
            acc.From = accountTransactionId;
            acc.To = accountTransactionId2;
            acc.id = acc.id + 1;
            await ctx.stub.putState(`${Vbank}sendBTC@quant.com`, Buffer.from(JSON.stringify(acc)));
          }    
        if (exists && (Operacion == 'Deposito') && Vdescription == 'Deposito Red Quant')  {
          const AccountTransactionRecord = await ctx.stub.getState(accountTransactionId2); 
          const acc: AccountTransaction = JSON.parse(AccountTransactionRecord.toString());
          acc.TypeTransaction = Operacion;
          acc.Ammount = Vammount;
          acc.Balance =   acc.Balance + Vammount; 
          acc.Commission = 0;
          acc.Bank = Vbank2;
          acc.Description = Vdescription;
          acc.CreateDate = new Date();
          acc.From = accountTransactionId;
          acc.To = accountTransactionId2;
          await ctx.stub.putState(accountTransactionId2, Buffer.from(JSON.stringify(acc)));
        }
        if ((!exists) && Operacion == 'Deposito' && Vdescription == 'Deposito Red Quant'){
              const accountTransaction = new AccountTransaction();
              accountTransaction.TypeTransaction = Operacion;
              accountTransaction.Ammount = Vammount;
              accountTransaction.Balance = Vammount;
              accountTransaction.Commission = 0;
              accountTransaction.AmmountComission = 0;
              accountTransaction.Bank = Vbank2;
              accountTransaction.Description = Vdescription;
              accountTransaction.CreateDate = new Date();
              accountTransaction.From = accountTransactionId;
              accountTransaction.To = accountTransactionId2;
              const buffer = Buffer.from(JSON.stringify(accountTransaction));
              await ctx.stub.putState(accountTransactionId2, buffer);
         }
        if ((!exists) && Operacion == 'Deposito' && Vdescription == 'Deposito TC'){
            const accountTransaction = new AccountTransaction();
            accountTransaction.TypeTransaction = Operacion;
            accountTransaction.Ammount = Vammount;
            accountTransaction.Balance = Vammount;
            accountTransaction.Commission = 0;
            accountTransaction.AmmountComission = 0;
            accountTransaction.Bank = Vbank2;
            accountTransaction.Description = Vdescription;
            accountTransaction.CreateDate = new Date();
            accountTransaction.From = accountTransactionId;
            accountTransaction.To = accountTransactionId2;
            accountTransaction.id = 0; 
            accountTransaction.txid=ctx.stub.getTxID();
            const buffer = Buffer.from(JSON.stringify(accountTransaction));
            await ctx.stub.putState(`${Vbank}sendBTC@quant.com`, buffer);
        }
      await this.createConcilBank(ctx,Vbank,Vbank2,Vammount, Operacion);
      return;
      }
       catch {
        throw new Error(JSON.stringify({error:4200, descripcion:'Fallo la transaccion'}));;    
       }
   }
   else {
    throw new Error(JSON.stringify({error:4200, descripcion:'Balance no disponible'}));
   }
  }
  else {
    await this.createAccountTransactionQusdtSNsignature(ctx, accountTransactionId, accountTransactionId2, Vammount, Operacion, Vbank, Vbank2, Vdescription, Vcurrency)
  }
  }
  @Transaction()
  public async createConcilBank(ctx: Context, vbank: string, vbank2: string, vammount: number, Operacion: string): Promise<void> {
    try{ 
     const concilexists = await this.ConcilBankExist(ctx, vbank,vbank2,Operacion);
      if  (concilexists && (Operacion == 'Retiro')) {
          const ConcilBankRecord = await ctx.stub.getState(vbank); 
          const accBank: ConcilBank = JSON.parse(ConcilBankRecord.toString());
          accBank.Bank = vbank2;
          accBank.Amount = vammount;
          accBank.CreateDate = new Date();
          accBank.Accion = 'Enviar';
          await ctx.stub.putState(vbank, Buffer.from(JSON.stringify(accBank)));
          return;
      }
      if (concilexists && (Operacion == 'Deposito')) {   
        const ConcilBankRecord = await ctx.stub.getState(vbank2); 
        const accBank1: ConcilBank = JSON.parse(ConcilBankRecord.toString());
        accBank1.Bank = vbank;
        accBank1.Accion = 'Recibir';
        accBank1.Amount = vammount;
        accBank1.CreateDate = new Date(); 
        await ctx.stub.putState(vbank2, Buffer.from(JSON.stringify(accBank1)));
        return;
      }         
      if (!concilexists && (Operacion == 'Retiro')) {
          const accBank = new ConcilBank();
          accBank.Bank = vbank2;
          accBank.Amount = vammount;
          accBank.CreateDate = new Date;
          accBank.Accion = 'Enviar';
          const buffer = Buffer.from(JSON.stringify(accBank));
          await ctx.stub.putState(vbank, buffer);
          return;
      }
      if (!concilexists && (Operacion == 'Deposito')) {
        const accBank = new ConcilBank();
        accBank.Bank = vbank;
        accBank.Amount = vammount;
        accBank.CreateDate = new Date;
        accBank.Accion = 'Recibir';
        const buffer1 = Buffer.from(JSON.stringify(accBank));
        await ctx.stub.putState(vbank2, buffer1);
        return;
      }
    }
    catch {
      throw new Error(JSON.stringify({error:5000, descripcion:'Fallo la creación de la conciliación'}));
    }
  }
  
  @Transaction(false)
  public async queryAllAssetsTransaction(ctx: Context, id: string): Promise<string> {
      const iterator = await ctx.stub.getHistoryForKey(id);
      const allResults = [];
      while (true) {
        const res = await iterator.next();
        if (res.value && res.value.value.toString()) {
         console.log(res.value.value.toString('utf8'));
         let Record;
         try {
           Record = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
         console.log(err);
         Record = res.value.value.toString('utf8');
         }
        allResults.push({ Record });
        }
        if (res.done) {
         console.log('end of data');
         await iterator.close();
         console.info(allResults);
         return JSON.stringify(allResults);
        }
      } 
   }
   @Transaction()
    public async initTransaction(ctx: Context, accountTransactionId: string): Promise<void> {
        await ctx.stub.deleteState(accountTransactionId);
   } 

}
