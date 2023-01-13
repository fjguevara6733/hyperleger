/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { AccountTransactionContract } from '.';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('AccountTransactionContract', () => {

    let contract: AccountTransactionContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new AccountTransactionContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"account transaction 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"account transaction 1002 value"}'));
    });

    describe('#accountTransactionExists', () => {

        it('should return true for a account transaction', async () => {
            await contract.accountTransactionExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a account transaction that does not exist', async () => {
            await contract.accountTransactionExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createAccountTransaction', () => {

        it('should create a account transaction', async () => {
            await contract.createAccountTransaction(ctx, '1003', 'account transaction 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"account transaction 1003 value"}'));
        });

        it('should throw an error for a account transaction that already exists', async () => {
            await contract.createAccountTransaction(ctx, '1001', 'myvalue').should.be.rejectedWith(/The account transaction 1001 already exists/);
        });

    });

    describe('#readAccountTransaction', () => {

        it('should return a account transaction', async () => {
            await contract.readAccountTransaction(ctx, '1001').should.eventually.deep.equal({ value: 'account transaction 1001 value' });
        });

        it('should throw an error for a account transaction that does not exist', async () => {
            await contract.readAccountTransaction(ctx, '1003').should.be.rejectedWith(/The account transaction 1003 does not exist/);
        });

    });

    describe('#updateAccountTransaction', () => {

        it('should update a account transaction', async () => {
            await contract.updateAccountTransaction(ctx, '1001', 'account transaction 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"account transaction 1001 new value"}'));
        });

        it('should throw an error for a account transaction that does not exist', async () => {
            await contract.updateAccountTransaction(ctx, '1003', 'account transaction 1003 new value').should.be.rejectedWith(/The account transaction 1003 does not exist/);
        });

    });

    describe('#deleteAccountTransaction', () => {

        it('should delete a account transaction', async () => {
            await contract.deleteAccountTransaction(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a account transaction that does not exist', async () => {
            await contract.deleteAccountTransaction(ctx, '1003').should.be.rejectedWith(/The account transaction 1003 does not exist/);
        });

    });

});
